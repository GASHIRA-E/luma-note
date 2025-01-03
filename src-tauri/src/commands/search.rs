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

async fn find_memo_from_db(
    sqlite_pool: Pool<Sqlite>,
    memo_title: String,
    tags: Vec<i32>,
) -> Result<Vec<DetailMemoInfo>, ()> {
    // メモタイトルとタグIDを結合して検索する
    // メモタイトルはLIKE検索
    // タグIDはIN検索
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
        WHERE m.title LIKE ?
        {}
        "#,
        if tags.is_empty() {
            ""
        } else {
            "AND mt.tag_id IN (SELECT value FROM json_each(?))"
        }
    );

    let mut query = sqlx::query_as::<_, RawDetailMemo>(&sql).bind(format!("%{}%", memo_title));

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

    #[tokio::test]
    async fn test_メモを検索できること() {
        let sqlite_pool = setup_test_db().await;

        create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();
        create_tag_in_db(sqlite_pool.clone(), "tag2".to_string())
            .await
            .unwrap();

        let memo = CreateMemoIn {
            title: "test".to_string(),
            folder_id: Some(1),
            content: "test".to_string(),
            tags: Some(vec![1, 2]),
        };
        create_memo_in_db(sqlite_pool.clone(), memo).await.unwrap();

        let memos = find_memo_from_db(sqlite_pool.clone(), "test".to_string(), vec![1, 2])
            .await
            .unwrap();
        assert_eq!(memos.len(), 1);
    }

    #[tokio::test]
    async fn test_タグのみ検索ができること() {
        let sqlite_pool = setup_test_db().await;

        create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();
        create_tag_in_db(sqlite_pool.clone(), "tag2".to_string())
            .await
            .unwrap();

        let memo = CreateMemoIn {
            title: "test".to_string(),
            folder_id: Some(1),
            content: "test".to_string(),
            tags: Some(vec![1]),
        };
        create_memo_in_db(sqlite_pool.clone(), memo).await.unwrap();

        let memo2 = CreateMemoIn {
            title: "test2".to_string(),
            folder_id: Some(1),
            content: "test2".to_string(),
            tags: Some(vec![2]),
        };
        create_memo_in_db(sqlite_pool.clone(), memo2).await.unwrap();

        let memos = find_memo_from_db(sqlite_pool.clone(), "".to_string(), vec![1, 2])
            .await
            .unwrap();
        assert_eq!(memos.len(), 2);
        assert_eq!(
            memos[0].tags,
            Some(vec![TagInfo {
                id: 1,
                name: "tag1".to_string()
            }])
        );
        assert_eq!(
            memos[1].tags,
            Some(vec![TagInfo {
                id: 2,
                name: "tag2".to_string()
            }])
        );
    }

    #[tokio::test]
    async fn test_テキストタイトルのみでも検索できること() {
        let sqlite_pool = setup_test_db().await;

        create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        let memo = CreateMemoIn {
            title: "test".to_string(),
            folder_id: Some(1),
            content: "test".to_string(),
            tags: Some(vec![1]),
        };
        create_memo_in_db(sqlite_pool.clone(), memo).await.unwrap();

        let memo2 = CreateMemoIn {
            title: "test2".to_string(),
            folder_id: Some(1),
            content: "test2".to_string(),
            tags: Some(vec![2]),
        };
        create_memo_in_db(sqlite_pool.clone(), memo2).await.unwrap();

        let memo3 = CreateMemoIn {
            title: "hoge".to_string(),
            folder_id: Some(1),
            content: "hoge".to_string(),
            tags: Some(vec![3]),
        };
        create_memo_in_db(sqlite_pool.clone(), memo3).await.unwrap();

        let memos = find_memo_from_db(sqlite_pool.clone(), "test".to_string(), vec![])
            .await
            .unwrap();
        assert_eq!(memos.len(), 2);
    }
}
