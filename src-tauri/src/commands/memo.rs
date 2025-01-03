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

async fn get_memo_list_from_db(
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
        WHERE m.folder_id = ?
        GROUP BY m.id, m.title, m.updated_at"#;

    let raw_memos = sqlx::query_as::<_, RawMemoList>(SQL)
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

async fn get_detail_memo_in_db(
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

async fn create_memo_in_db(sqlite_pool: Pool<Sqlite>, memo: CreateMemoIn) -> Result<i32, ()> {
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
    let mut tx = sqlite_pool.begin().await.map_err(|_| ())?;

    // メモの更新
    if let (Some(title), Some(content)) = (memo.title, memo.content) {
        const UPDATE_MEMO_SQL: &str =
            "UPDATE Memos SET title = ?, folder_id = ?, content = ? WHERE id = ?";
        sqlx::query(UPDATE_MEMO_SQL)
            .bind(&title)
            .bind(memo.folder_id.unwrap_or(0))
            .bind(&content)
            .bind(memo.id)
            .execute(&mut *tx)
            .await
            .map_err(|_| ())?;
    }

    // タグの更新
    if let Some(tags) = memo.tags {
        // 既存のタグ関連をすべて削除
        const DELETE_TAGS_SQL: &str = "DELETE FROM MemoTagRelations WHERE memo_id = ?";
        sqlx::query(DELETE_TAGS_SQL)
            .bind(memo.id)
            .execute(&mut *tx)
            .await
            .map_err(|_| ())?;

        // 新しいタグを追加
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
    use crate::types::TagInfo;
    use sqlx::sqlite::SqlitePoolOptions;

    async fn setup_test_db() -> Pool<Sqlite> {
        let sqlite_pool = SqlitePoolOptions::new()
            .connect("sqlite::memory:")
            .await
            .unwrap();

        // テーブル作成
        create_tables(&sqlite_pool).await;

        sqlite_pool
    }

    async fn create_tables(pool: &Pool<Sqlite>) {
        sqlx::query(
            "DROP TABLE IF EXISTS MemoTagRelations;
             DROP TABLE IF EXISTS Memos;
             DROP TABLE IF EXISTS Folders;
             DROP TABLE IF EXISTS Tags;

             CREATE TABLE IF NOT EXISTS Folders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Memos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                folder_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (folder_id) REFERENCES Folders(id) ON DELETE CASCADE
            );
    
            CREATE TABLE IF NOT EXISTS MemoTagRelations (
                memo_id INTEGER,
                tag_id INTEGER,
                PRIMARY KEY (memo_id, tag_id),
                FOREIGN KEY (memo_id) REFERENCES Memos(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES Tags(id) ON DELETE CASCADE
            );",
        )
        .execute(pool)
        .await
        .unwrap();
    }

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
            folder_id: 1,
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
            folder_id,
            content: "test_content1".to_string(),
            tags: Some(vec![1]),
        };
        create_memo_in_db(sqlite_pool.clone(), memo1).await.unwrap();

        let memo2 = CreateMemoIn {
            title: "test2".to_string(),
            folder_id,
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
            folder_id,
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
            folder_id,
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
            folder_id: Some(folder_id),
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
            folder_id,
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
}
