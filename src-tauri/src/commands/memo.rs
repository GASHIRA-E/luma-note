use crate::types::{
    CreateMemoIn, DetailMemoInfo, MemoListInfo, RawDetailMemo, RawMemoList, TagInfo, UpdateMemoIn,
};
use sqlx::{Pool, Sqlite};

#[tauri::command]
pub async fn get_memo_list(
    state: tauri::State<'_, Pool<Sqlite>>,
    folder_id: i32,
) -> Result<Vec<MemoListInfo>, ()> {
    let memos = get_memo_list_from_db(state.inner().clone(), folder_id).await?;
    Ok(memos)
}

pub async fn get_memo_list_from_db(
    sqlite_pool: Pool<Sqlite>,
    folder_id: i32,
) -> Result<Vec<MemoListInfo>, ()> {
    const SQL: &str = r#"
    SELECT 
        m.id,
        m.title,
        m.updated_at,
        json_group_array(
            json_object(
                'id', t.id,
                'name', t.name
            )
        ) as tags
    FROM Memos m
    LEFT JOIN MemoTagRelations mt ON m.id = mt.memo_id
    LEFT JOIN Tags t ON mt.tag_id = t.id
    WHERE (? > 0 AND m.folder_id = ?) OR (? = 0 AND m.folder_id IS NULL)
    GROUP BY m.id, m.title, m.updated_at"#;

    let raw_memos = sqlx::query_as::<_, RawMemoList>(SQL)
        .bind(folder_id)
        .bind(folder_id)
        .bind(folder_id)
        .fetch_all(&sqlite_pool)
        .await
        .map_err(|_| ())?;

    let memos = raw_memos
        .into_iter()
        .map(|m| MemoListInfo {
            id: m.id,
            title: m.title,
            updated_at: m.updated_at,
            tags: m.tags.and_then(|t| serde_json::from_str(&t).ok()),
        })
        .collect();

    Ok(memos)
}

#[tauri::command]
pub async fn get_detail_memo(
    state: tauri::State<'_, Pool<Sqlite>>,
    memo_id: i32,
) -> Result<DetailMemoInfo, ()> {
    let memo = get_detail_memo_in_db(state.inner().clone(), memo_id).await?;
    Ok(memo)
}

pub async fn get_detail_memo_in_db(
    sqlite_pool: Pool<Sqlite>,
    memo_id: i32,
) -> Result<DetailMemoInfo, ()> {
    const SQL: &str = r#"
        SELECT 
            m.id,
            m.title,
            m.content,
            m.updated_at,
            m.folder_id,
            CASE 
                WHEN COUNT(t.id) > 0 THEN json_group_array(
                    json_object(
                        'id', t.id,
                        'name', t.name
                    )
                )
                ELSE NULL 
            END as tags
        FROM Memos m
        LEFT JOIN MemoTagRelations mt ON m.id = mt.memo_id
        LEFT JOIN Tags t ON mt.tag_id = t.id
        WHERE m.id = ?
        GROUP BY m.id, m.title, m.content, m.updated_at, m.folder_id"#;

    let raw_memo = sqlx::query_as::<_, RawDetailMemo>(SQL)
        .bind(memo_id)
        .fetch_one(&sqlite_pool)
        .await
        .map_err(|_| ())?;

    let tags = if let Some(tags_json) = raw_memo.tags {
        let parse_result = serde_json::from_str::<Vec<TagInfo>>(&tags_json);
        Some(parse_result.map_err(|_| ())?)
    } else {
        None
    };

    Ok(DetailMemoInfo {
        id: raw_memo.id,
        title: raw_memo.title,
        content: raw_memo.content,
        updated_at: raw_memo.updated_at,
        folder_id: raw_memo.folder_id,
        tags,
    })
}

#[tauri::command]
pub async fn create_memo(
    state: tauri::State<'_, Pool<Sqlite>>,
    memo: CreateMemoIn,
) -> Result<i32, ()> {
    let memo_id = create_memo_in_db(state.inner().clone(), memo).await?;
    Ok(memo_id)
}

pub async fn create_memo_in_db(sqlite_pool: Pool<Sqlite>, memo: CreateMemoIn) -> Result<i32, ()> {
    // トランザクション開始
    let mut tx = sqlite_pool.begin().await.map_err(|_| ())?;

    // メモを作成
    const MEMO_SQL: &str = "INSERT INTO Memos (title, folder_id, content) VALUES (?, ?, ?)";
    let result = sqlx::query(MEMO_SQL)
        .bind(&memo.title)
        .bind(memo.folder_id)
        .bind(&memo.content)
        .execute(&mut *tx)
        .await
        .map_err(|_| ())?;

    let memo_id = result.last_insert_rowid();

    // タグが存在する場合、一括で関連付けを作成
    if let Some(tags) = memo.tags {
        const TAG_SQL: &str = "INSERT INTO MemoTagRelations (memo_id, tag_id) 
             SELECT ?, value FROM json_each(?)";

        sqlx::query(TAG_SQL)
            .bind(memo_id)
            .bind(serde_json::to_string(&tags).map_err(|_| ())?)
            .execute(&mut *tx)
            .await
            .map_err(|_| ())?;
    }

    // トランザクションをコミット
    tx.commit().await.map_err(|_| ())?;

    Ok(memo_id as i32)
}

#[tauri::command]
pub async fn delete_memo(state: tauri::State<'_, Pool<Sqlite>>, memo_id: i32) -> Result<(), ()> {
    delete_memo_in_db(state.inner().clone(), memo_id).await?;
    Ok(())
}

async fn delete_memo_in_db(sqlite_pool: Pool<Sqlite>, memo_id: i32) -> Result<(), ()> {
    const SQL: &str = "DELETE FROM Memos WHERE id = ?";
    let result = sqlx::query(SQL)
        .bind(memo_id)
        .execute(&sqlite_pool)
        .await
        .map_err(|_| ())?;

    // 削除された行が0の場合（該当するIDが存在しない場合）はエラーを返す
    if result.rows_affected() == 0 {
        return Err(());
    }

    Ok(())
}

#[tauri::command]
pub async fn update_memo(
    state: tauri::State<'_, Pool<Sqlite>>,
    memo: UpdateMemoIn,
) -> Result<(), ()> {
    update_memo_in_db(state.inner().clone(), memo).await?;
    Ok(())
}

async fn update_memo_in_db(sqlite_pool: Pool<Sqlite>, memo: UpdateMemoIn) -> Result<(), ()> {
    // 更新対象のフィールドが1つも存在しないかつタグの更新もない場合は早期リターン
    if memo.title.is_none()
        && memo.content.is_none()
        && memo.folder_id.is_none()
        && memo.tags.is_none()
    {
        return Ok(());
    }

    let mut tx = sqlite_pool.begin().await.map_err(|_| ())?;

    // メモの更新
    let mut update_parts = Vec::new();
    let mut bindings: Vec<String> = Vec::new();

    if let Some(title) = &memo.title {
        update_parts.push("title = ?");
        bindings.push(title.clone());
    }

    if let Some(content) = &memo.content {
        update_parts.push("content = ?");
        bindings.push(content.clone());
    }

    if let Some(folder_id) = memo.folder_id {
        update_parts.push("folder_id = ?");
        bindings.push(folder_id.to_string());
    }

    // メモのフィールド更新がある場合のみSQLを実行
    if !update_parts.is_empty() {
        let mut query = String::from("UPDATE Memos SET ");
        query.push_str(&update_parts.join(", "));
        query.push_str(" WHERE id = ?");

        let mut query_builder = sqlx::query(&query);

        for value in bindings {
            query_builder = query_builder.bind(value);
        }
        query_builder = query_builder.bind(memo.id);

        query_builder.execute(&mut *tx).await.map_err(|_| ())?;
    }

    // タグの更新
    if let Some(tags) = memo.tags {
        const DELETE_TAGS_SQL: &str = "DELETE FROM MemoTagRelations WHERE memo_id = ?";
        sqlx::query(DELETE_TAGS_SQL)
            .bind(memo.id)
            .execute(&mut *tx)
            .await
            .map_err(|_| ())?;

        for tag_id in tags {
            const INSERT_TAG_SQL: &str =
                "INSERT INTO MemoTagRelations (memo_id, tag_id) VALUES (?, ?)";
            sqlx::query(INSERT_TAG_SQL)
                .bind(memo.id)
                .bind(tag_id)
                .execute(&mut *tx)
                .await
                .map_err(|_| ())?;
        }
    }

    tx.commit().await.map_err(|_| ())?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::commands::folder::create_folder_in_db;
    use crate::commands::tag::create_tag_in_db;
    use crate::database::setup_test_db;
    use crate::types::TagInfo;

    #[tokio::test]
    async fn test_メモが作成して詳細取得できること() {
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

        let memo = get_detail_memo_in_db(sqlite_pool.clone(), 1).await.unwrap();
        assert_eq!(memo.title, "test".to_string());
        assert_eq!(
            memo.tags,
            Some(vec![
                TagInfo {
                    id: 1,
                    name: "tag1".to_string()
                },
                TagInfo {
                    id: 2,
                    name: "tag2".to_string()
                }
            ])
        );
    }

    #[tokio::test]
    async fn test_メモ一覧を取得できること() {
        let sqlite_pool = setup_test_db().await;

        let folder_id = create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();

        let memo1 = CreateMemoIn {
            title: "test1".to_string(),
            folder_id: Some(folder_id),
            content: "test_content1".to_string(),
            tags: Some(vec![1]),
        };
        create_memo_in_db(sqlite_pool.clone(), memo1).await.unwrap();

        let memo2 = CreateMemoIn {
            title: "test2".to_string(),
            folder_id: Some(folder_id),
            content: "test_content2".to_string(),
            tags: Some(vec![1]),
        };
        create_memo_in_db(sqlite_pool.clone(), memo2).await.unwrap();

        let memos = get_memo_list_from_db(sqlite_pool.clone(), folder_id)
            .await
            .unwrap();
        assert_eq!(memos.len(), 2);

        assert_eq!(memos[0].title, "test1".to_string());
        assert_eq!(
            memos[0].tags,
            Some(vec![TagInfo {
                id: 1,
                name: "tag1".to_string()
            }])
        );

        assert_eq!(memos[1].title, "test2".to_string());
        assert_eq!(
            memos[1].tags,
            Some(vec![TagInfo {
                id: 1,
                name: "tag1".to_string()
            }])
        );
    }

    #[tokio::test]
    async fn test_メモを更新できること() {
        let sqlite_pool = setup_test_db().await;

        let folder_id = create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        let tag_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();

        let memo = CreateMemoIn {
            title: "test".to_string(),
            folder_id: Some(folder_id),
            content: "test".to_string(),
            tags: Some(vec![1]),
        };
        let created_memo_id = create_memo_in_db(sqlite_pool.clone(), memo).await.unwrap();

        let update_memo = UpdateMemoIn {
            id: created_memo_id,
            title: Some("test2".to_string()),
            folder_id: Some(folder_id),
            content: Some("test2".to_string()),
            tags: Some(vec![tag_id]),
        };
        update_memo_in_db(sqlite_pool.clone(), update_memo)
            .await
            .unwrap();

        let memo = get_detail_memo_in_db(sqlite_pool.clone(), created_memo_id)
            .await
            .unwrap();
        assert_eq!(memo.title, "test2".to_string());
        assert_eq!(memo.folder_id, folder_id);
        assert_eq!(memo.content, "test2".to_string());
        assert_eq!(
            memo.tags,
            Some(vec![TagInfo {
                id: tag_id,
                name: "tag1".to_string()
            }])
        );
    }

    #[tokio::test]
    async fn test_メモのフォルダのみを更新できること() {
        let sqlite_pool = setup_test_db().await;
        let folder_id = create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        let folder2_id = create_folder_in_db(sqlite_pool.clone(), "test2".to_string())
            .await
            .unwrap();

        let tag_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();

        let memo = CreateMemoIn {
            title: "test".to_string(),
            folder_id: Some(folder_id),
            content: "test".to_string(),
            tags: Some(vec![tag_id]),
        };
        let created_memo_id = create_memo_in_db(sqlite_pool.clone(), memo).await.unwrap();

        let update_memo = UpdateMemoIn {
            id: created_memo_id,
            title: None,
            folder_id: Some(folder2_id),
            content: None,
            tags: None,
        };
        update_memo_in_db(sqlite_pool.clone(), update_memo)
            .await
            .unwrap();

        let memo = get_detail_memo_in_db(sqlite_pool.clone(), created_memo_id)
            .await
            .unwrap();
        assert_eq!(memo.folder_id, folder2_id);
        // フォルダ以外変更されていないこと
        assert_eq!(memo.title, "test".to_string());
        assert_eq!(memo.content, "test".to_string());
        assert_eq!(
            memo.tags,
            Some(vec![TagInfo {
                id: tag_id,
                name: "tag1".to_string()
            }])
        );
    }

    #[tokio::test]
    async fn test_メモのタイトルだけを更新できること() {
        let sqlite_pool = setup_test_db().await;

        let folder_id = create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        let tag_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();

        let memo = CreateMemoIn {
            title: "test".to_string(),
            folder_id: Some(folder_id),
            content: "test".to_string(),
            tags: Some(vec![tag_id]),
        };
        let created_memo_id = create_memo_in_db(sqlite_pool.clone(), memo).await.unwrap();

        // メモのタイトルを更新
        let update_memo = UpdateMemoIn {
            id: created_memo_id,
            title: Some("test2".to_string()),
            folder_id: None,
            content: None,
            tags: None,
        };
        update_memo_in_db(sqlite_pool.clone(), update_memo)
            .await
            .unwrap();

        let memo = get_detail_memo_in_db(sqlite_pool.clone(), created_memo_id)
            .await
            .unwrap();
        // メモのタイトルを更新を確認
        assert_eq!(memo.title, "test2".to_string());
        // 他のメモの情報は更新されていないこと
        assert_eq!(memo.folder_id, folder_id);
        assert_eq!(memo.content, "test".to_string());
        assert_eq!(
            memo.tags,
            Some(vec![TagInfo {
                id: tag_id,
                name: "tag1".to_string()
            }])
        );
    }

    #[tokio::test]
    async fn test_メモの内容だけを更新できること() {
        let sqlite_pool = setup_test_db().await;

        let folder_id = create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        let tag_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();

        let memo = CreateMemoIn {
            title: "test".to_string(),
            folder_id: Some(folder_id),
            content: "test".to_string(),
            tags: Some(vec![tag_id]),
        };
        let created_memo_id = create_memo_in_db(sqlite_pool.clone(), memo).await.unwrap();

        // メモの内容を更新
        let update_memo = UpdateMemoIn {
            id: created_memo_id,
            title: None,
            folder_id: None,
            content: Some("test2".to_string()),
            tags: None,
        };
        update_memo_in_db(sqlite_pool.clone(), update_memo)
            .await
            .unwrap();

        let memo = get_detail_memo_in_db(sqlite_pool.clone(), created_memo_id)
            .await
            .unwrap();
        // メモの内容を更新を確認
        assert_eq!(memo.content, "test2".to_string());
        // 他のメモの情報は更新されていないこと
        assert_eq!(memo.folder_id, folder_id);
        assert_eq!(memo.title, "test".to_string());
        assert_eq!(
            memo.tags,
            Some(vec![TagInfo {
                id: tag_id,
                name: "tag1".to_string()
            }])
        );
    }

    #[tokio::test]
    async fn test_メモのタグのみを更新できること() {
        let sqlite_pool = setup_test_db().await;

        let folder_id = create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        let tag_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();

        let tag2_id = create_tag_in_db(sqlite_pool.clone(), "tag2".to_string())
            .await
            .unwrap();

        let memo = CreateMemoIn {
            title: "test".to_string(),
            folder_id: Some(folder_id),
            content: "test".to_string(),
            tags: Some(vec![tag_id]),
        };
        let created_memo_id = create_memo_in_db(sqlite_pool.clone(), memo).await.unwrap();

        // メモの内容を更新
        let update_memo = UpdateMemoIn {
            id: created_memo_id,
            title: None,
            folder_id: None,
            content: None,
            tags: Some(vec![tag2_id]),
        };
        update_memo_in_db(sqlite_pool.clone(), update_memo)
            .await
            .unwrap();

        let memo = get_detail_memo_in_db(sqlite_pool.clone(), created_memo_id)
            .await
            .unwrap();
        // メモのタグを更新を確認
        assert_eq!(
            memo.tags,
            Some(vec![TagInfo {
                id: tag2_id,
                name: "tag2".to_string()
            }])
        );
        // 他のメモの情報は更新されていないこと
        assert_eq!(memo.folder_id, folder_id);
        assert_eq!(memo.title, "test".to_string());
        assert_eq!(memo.content, "test".to_string());
    }

    #[tokio::test]
    async fn test_前のタグを削除して別のタグを登録して更新できること() {
        let sqlite_pool = setup_test_db().await;

        // フォルダーを作成
        let folder_id = create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        // タグ1
        let tag1_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();

        // タグ2
        let tag2_id = create_tag_in_db(sqlite_pool.clone(), "tag2".to_string())
            .await
            .unwrap();

        // 更新前のメモ
        let memo = CreateMemoIn {
            title: "test".to_string(),
            folder_id: Some(folder_id),
            content: "test".to_string(),
            tags: Some(vec![tag1_id]),
        };
        let created_memo_id = create_memo_in_db(sqlite_pool.clone(), memo).await.unwrap();

        get_detail_memo_in_db(sqlite_pool.clone(), created_memo_id)
            .await
            .unwrap();

        // タグ1を削除してタグ2を登録
        let update_memo = UpdateMemoIn {
            id: created_memo_id,
            title: Some("test".to_string()),
            folder_id: Some(folder_id.into()),
            content: Some("test".to_string()),
            tags: Some(vec![tag2_id]),
        };
        update_memo_in_db(sqlite_pool.clone(), update_memo)
            .await
            .unwrap();

        let updated_memo = get_detail_memo_in_db(sqlite_pool.clone(), created_memo_id)
            .await
            .unwrap();

        assert_eq!(
            updated_memo.tags,
            Some(vec![TagInfo {
                id: tag2_id,
                name: "tag2".to_string()
            }])
        );
    }

    #[tokio::test]
    async fn test_メモを削除できること() {
        let sqlite_pool = setup_test_db().await;

        let folder_id = create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        // タグを作成
        let tag_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();

        let memo = CreateMemoIn {
            title: "test".to_string(),
            folder_id: Some(folder_id.into()),
            content: "test".to_string(),
            tags: Some(vec![tag_id]),
        };

        create_memo_in_db(sqlite_pool.clone(), memo).await.unwrap();

        delete_memo_in_db(sqlite_pool.clone(), 1).await.unwrap();

        let memos = get_memo_list_from_db(sqlite_pool.clone(), folder_id)
            .await
            .unwrap();
        assert_eq!(memos.len(), 0);
    }

    #[tokio::test]
    async fn test_存在しないメモを削除できないこと() {
        let sqlite_pool = setup_test_db().await;

        let result = delete_memo_in_db(sqlite_pool.clone(), 1).await;
        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_メモのfolder_idがnullの場合はfolder_idがnullのメモ一覧に表示されること() {
        let sqlite_pool = setup_test_db().await;

        let memo = CreateMemoIn {
            title: "test".to_string(),
            folder_id: None,
            content: "test".to_string(),
            tags: Some(vec![]),
        };
        create_memo_in_db(sqlite_pool.clone(), memo).await.unwrap();

        let memos = get_memo_list_from_db(sqlite_pool.clone(), 0).await.unwrap();
        assert_eq!(memos.len(), 1);
        assert_eq!(memos[0].id, 1);
    }
}
