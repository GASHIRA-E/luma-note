use crate::types::{DetailMemoInfo, RawDetailMemo, TagInfo};
use sqlx::{Pool, Sqlite};
#[tauri::command]
pub async fn find_memo(
    state: tauri::State<'_, Pool<Sqlite>>,
    memo_title: String,
    tags: Vec<i32>,
) -> Result<Vec<DetailMemoInfo>, ()> {
    let memos = find_memo_from_db(state.inner().clone(), memo_title, tags).await?;
    Ok(memos)
}

/// title: 部分一致
/// tags: ORにてひとつでも含まれている場合
/// title と tags は AND にて検索される
async fn find_memo_from_db(
    sqlite_pool: Pool<Sqlite>,
    memo_title: String,
    tags: Vec<i32>,
) -> Result<Vec<DetailMemoInfo>, ()> {
    let sql = format!(
        r#"
        SELECT DISTINCT
            m.id,
            m.title,
            m.content,
            m.updated_at,
            m.folder_id,
            (
                SELECT json_group_array(json_object('id', t.id, 'name', t.name))
                FROM MemoTagRelations mtr
                JOIN Tags t ON t.id = mtr.tag_id
                WHERE mtr.memo_id = m.id
            ) as tags
        FROM Memos m
        LEFT JOIN MemoTagRelations mt ON m.id = mt.memo_id
        LEFT JOIN Tags t ON mt.tag_id = t.id
        WHERE 1=1
        {}
        {}
        GROUP BY m.id
        ORDER BY m.id
        "#,
        if memo_title.is_empty() {
            ""
        } else {
            "AND m.title LIKE ?"
        },
        if tags.is_empty() {
            ""
        } else {
            "AND m.id IN (
                SELECT DISTINCT memo_id 
                FROM MemoTagRelations 
                WHERE tag_id IN (SELECT value FROM json_each(?))
            )"
        }
    );

    let mut query = sqlx::query_as::<_, RawDetailMemo>(&sql);

    if !memo_title.is_empty() {
        query = query.bind(format!("%{}%", memo_title));
    }

    if !tags.is_empty() {
        query = query.bind(serde_json::to_string(&tags).unwrap());
    }

    let raw_memos = query.fetch_all(&sqlite_pool).await.map_err(|_| ())?;

    let memos = raw_memos
        .into_iter()
        .map(|m| DetailMemoInfo {
            id: m.id,
            title: m.title,
            content: m.content,
            updated_at: m.updated_at,
            folder_id: m.folder_id,
            tags: serde_json::from_str::<Vec<TagInfo>>(&m.tags.unwrap_or_else(|| "[]".to_string()))
                .ok()
                .and_then(|v| if v.is_empty() { None } else { Some(v) }),
        })
        .collect();

    Ok(memos)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::commands::folder::create_folder_in_db;
    use crate::commands::memo::create_memo_in_db;
    use crate::commands::tag::create_tag_in_db;
    use crate::database::setup_test_db;
    use crate::types::CreateMemoIn;
    use crate::types::NullableId;

    #[cfg(test)]
    async fn setup_test_data(sqlite_pool: Pool<Sqlite>) -> Vec<TagInfo> {
        //[
        //    {
        //     id: 1,
        //     title: "abc",
        //     tags: ["rust", "typescript", "javascript"],
        //   },
        //   {
        //     id: 2,
        //     title: "abcd",
        //     tags: ["rust", "typescript"],
        //   },
        //   {
        //     id: 3,
        //     title: "abcde",
        //     tags: [],
        //   },
        //   {
        //     id: 4,
        //     title: "abcdef",
        //     tags: ["typescript"],
        //   }
        // ]

        create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        let rust_tag_id = create_tag_in_db(sqlite_pool.clone(), "rust".to_string())
            .await
            .unwrap();
        let typescript_tag_id = create_tag_in_db(sqlite_pool.clone(), "typescript".to_string())
            .await
            .unwrap();

        let javascript_tag_id = create_tag_in_db(sqlite_pool.clone(), "javascript".to_string())
            .await
            .unwrap();

        create_memo_in_db(
            sqlite_pool.clone(),
            CreateMemoIn {
                title: "abc".to_string(),
                folder_id: NullableId::Value(Some(1)),
                content: "test".to_string(),
                tags: Some(vec![rust_tag_id, typescript_tag_id, javascript_tag_id]),
            },
        )
        .await
        .unwrap();

        create_memo_in_db(
            sqlite_pool.clone(),
            CreateMemoIn {
                title: "abcd".to_string(),
                folder_id: NullableId::Value(Some(1)),
                content: "test".to_string(),
                tags: Some(vec![rust_tag_id, typescript_tag_id]),
            },
        )
        .await
        .unwrap();

        create_memo_in_db(
            sqlite_pool.clone(),
            CreateMemoIn {
                title: "abcde".to_string(),
                folder_id: NullableId::Value(Some(1)),
                content: "test".to_string(),
                tags: Some(vec![]),
            },
        )
        .await
        .unwrap();

        create_memo_in_db(
            sqlite_pool.clone(),
            CreateMemoIn {
                title: "abcdef".to_string(),
                folder_id: NullableId::Value(Some(1)),
                content: "test".to_string(),
                tags: Some(vec![typescript_tag_id]),
            },
        )
        .await
        .unwrap();

        vec![
            TagInfo {
                id: rust_tag_id,
                name: "rust".to_string(),
            },
            TagInfo {
                id: typescript_tag_id,
                name: "typescript".to_string(),
            },
            TagInfo {
                id: javascript_tag_id,
                name: "javascript".to_string(),
            },
        ]
    }

    #[tokio::test]
    async fn test_タイトルとタグの両方で検索できること() {
        let sqlite_pool = setup_test_db().await;
        let tags = setup_test_data(sqlite_pool.clone()).await;

        // tags = [1:rust, 2:typescript]
        // title = "abc"
        let memos = find_memo_from_db(
            sqlite_pool.clone(),
            "abc".to_string(),
            vec![tags[0].id as i32, tags[1].id as i32],
        )
        .await
        .unwrap();
        assert_eq!(memos.len(), 3);
        assert_eq!(memos[0].id, 1);
        assert_eq!(memos[1].id, 2);
        assert_eq!(memos[2].id, 4);
    }

    #[tokio::test]
    async fn test_タグのみ検索ができること() {
        let sqlite_pool = setup_test_db().await;
        let tags = setup_test_data(sqlite_pool.clone()).await;

        // tags = [2:typescript, 3:javascript]
        // title = ""
        let memos = find_memo_from_db(
            sqlite_pool.clone(),
            "".to_string(),
            vec![tags[1].id as i32, tags[2].id as i32],
        )
        .await
        .unwrap();
        assert_eq!(memos.len(), 3);
        assert_eq!(memos[0].id, 1);
        assert_eq!(memos[1].id, 2);
        assert_eq!(memos[2].id, 4);
    }

    #[tokio::test]
    async fn test_テキストタイトルのみでも検索できること() {
        let sqlite_pool = setup_test_db().await;
        setup_test_data(sqlite_pool.clone()).await;

        // tags = []
        // title = "e"
        let memos = find_memo_from_db(sqlite_pool.clone(), "e".to_string(), vec![])
            .await
            .unwrap();
        assert_eq!(memos.len(), 2);
        assert_eq!(memos[0].id, 3);
        assert_eq!(memos[1].id, 4);
    }
}
