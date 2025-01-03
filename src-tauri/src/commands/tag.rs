use crate::types::TagInfo;
use sqlx::{Pool, Sqlite};

#[tauri::command]
pub async fn create_tag(state: tauri::State<'_, Pool<Sqlite>>, name: String) -> Result<i32, ()> {
    let tag_id = create_tag_in_db(state.inner().clone(), name).await?;
    Ok(tag_id)
}

pub async fn create_tag_in_db(sqlite_pool: Pool<Sqlite>, name: String) -> Result<i32, ()> {
    let tag = sqlx::query("INSERT INTO Tags (name) VALUES (?)")
        .bind(name)
        .execute(&sqlite_pool)
        .await
        .unwrap();
    Ok(tag.last_insert_rowid() as i32)
}

#[tauri::command]
pub async fn delete_tag(state: tauri::State<'_, Pool<Sqlite>>, tag_id: i32) -> Result<(), ()> {
    delete_tag_in_db(state.inner().clone(), tag_id).await?;
    Ok(())
}

async fn delete_tag_in_db(sqlite_pool: Pool<Sqlite>, tag_id: i32) -> Result<(), ()> {
    const SQL: &str = "DELETE FROM Tags WHERE id = ?";
    let result = sqlx::query(SQL)
        .bind(tag_id)
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
pub async fn get_tags(state: tauri::State<'_, Pool<Sqlite>>) -> Result<Vec<TagInfo>, ()> {
    let tags = get_tags_from_db(state.inner().clone()).await?;
    Ok(tags)
}

async fn get_tags_from_db(sqlite_pool: Pool<Sqlite>) -> Result<Vec<TagInfo>, ()> {
    const SQL: &str = "SELECT id, name FROM Tags";
    let tags = sqlx::query_as::<_, TagInfo>(SQL)
        .fetch_all(&sqlite_pool)
        .await
        .map_err(|_| ())?;
    Ok(tags)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::commands::memo::create_memo_in_db;
    use crate::types::CreateMemoIn;
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
            "
        CREATE TABLE IF NOT EXISTS Folders(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- id=0のデフォルトフォルダを作成
        INSERT INTO Folders (id, name) VALUES (0, 'フォルダなし');

        CREATE TABLE IF NOT EXISTS Memos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            folder_id INTEGER DEFAULT 0, -- folderID=0:フォルダ未選択
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (folder_id) REFERENCES Folders(id) ON DELETE SET DEFAULT
        );

        CREATE TABLE IF NOT EXISTS Tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
    async fn test_タグ作成できること() {
        let sqlite_pool = setup_test_db().await;

        let tag_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();
        let tags = get_tags_from_db(sqlite_pool.clone()).await.unwrap();
        assert_eq!(tags.len(), 1);
        assert_eq!(tags[0].id, tag_id);
        assert_eq!(tags[0].name, "tag1");
    }

    #[tokio::test]
    async fn test_タグ一覧取得できること() {
        let sqlite_pool = setup_test_db().await;

        create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();
        create_tag_in_db(sqlite_pool.clone(), "tag2".to_string())
            .await
            .unwrap();
        let tags = get_tags_from_db(sqlite_pool.clone()).await.unwrap();
        assert_eq!(tags.len(), 2);
        assert_eq!(tags[0].id, 1);
        assert_eq!(tags[0].name, "tag1");
        assert_eq!(tags[1].id, 2);
        assert_eq!(tags[1].name, "tag2");
    }

    #[tokio::test]
    async fn test_タグ削除できること() {
        let sqlite_pool = setup_test_db().await;

        let tag_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();
        delete_tag_in_db(sqlite_pool.clone(), tag_id).await.unwrap();
        let tags = get_tags_from_db(sqlite_pool.clone()).await.unwrap();
        assert_eq!(tags.len(), 0);
    }

    #[tokio::test]
    async fn test_メモに紐づいたタグを削除したときリレーションテーブルも削除されること() {
        let sqlite_pool = setup_test_db().await;

        sqlx::query("INSERT INTO Folders (name) VALUES (?)")
            .bind("test folder")
            .execute(&sqlite_pool)
            .await
            .unwrap();
        let tag_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();
        let memo_id = create_memo_in_db(
            sqlite_pool.clone(),
            CreateMemoIn {
                title: "memo1".to_string(),
                folder_id: 0,
                content: "content1".to_string(),
                tags: Some(vec![tag_id]),
            },
        )
        .await
        .unwrap();

        // タグを削除する前にリレーションの存在を確認
        const SQL: &str =
            "SELECT COUNT(*) as count FROM MemoTagRelations WHERE memo_id = ? AND tag_id = ?";
        let relations = sqlx::query_as::<_, (i64,)>(SQL)
            .bind(memo_id)
            .bind(tag_id)
            .fetch_one(&sqlite_pool)
            .await
            .unwrap();
        assert_eq!(relations.0, 1);

        delete_tag_in_db(sqlite_pool.clone(), tag_id).await.unwrap();

        // タグ削除後にリレーションが削除されていることを確認
        let relations = sqlx::query_as::<_, (i64,)>(SQL)
            .bind(memo_id)
            .bind(tag_id)
            .fetch_one(&sqlite_pool)
            .await
            .unwrap();
        assert_eq!(relations.0, 0);
    }
}

#[tauri::command]
pub async fn delete_tag(state: tauri::State<'_, Pool<Sqlite>>, tag_id: i64) -> Result<(), ()> {
    delete_tag_in_db(state.inner().clone(), tag_id).await?;
    Ok(())
}

async fn delete_tag_in_db(sqlite_pool: Pool<Sqlite>, tag_id: i64) -> Result<(), ()> {
    const SQL: &str = "DELETE FROM Tags WHERE id = ?";
    let result = sqlx::query(SQL)
        .bind(tag_id)
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
pub async fn get_tags(state: tauri::State<'_, Pool<Sqlite>>) -> Result<Vec<TagInfo>, ()> {
    let tags = get_tags_from_db(state.inner().clone()).await?;
    Ok(tags)
}

async fn get_tags_from_db(sqlite_pool: Pool<Sqlite>) -> Result<Vec<TagInfo>, ()> {
    const SQL: &str = "SELECT id, name FROM Tags";
    let tags = sqlx::query_as::<_, TagInfo>(SQL)
        .fetch_all(&sqlite_pool)
        .await
        .map_err(|_| ())?;
    Ok(tags)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::commands::memo::create_memo_in_db;
    use crate::database::setup_test_db;
    use crate::types::CreateMemoIn;

    #[tokio::test]
    async fn test_タグ作成できること() {
        let sqlite_pool = setup_test_db().await;

        let tag_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();
        let tags = get_tags_from_db(sqlite_pool.clone()).await.unwrap();
        assert_eq!(tags.len(), 1);
        assert_eq!(tags[0].id, tag_id);
        assert_eq!(tags[0].name, "tag1");
    }

    #[tokio::test]
    async fn test_タグ一覧取得できること() {
        let sqlite_pool = setup_test_db().await;

        create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();
        create_tag_in_db(sqlite_pool.clone(), "tag2".to_string())
            .await
            .unwrap();
        let tags = get_tags_from_db(sqlite_pool.clone()).await.unwrap();
        assert_eq!(tags.len(), 2);
        assert_eq!(tags[0].id, 1);
        assert_eq!(tags[0].name, "tag1");
        assert_eq!(tags[1].id, 2);
        assert_eq!(tags[1].name, "tag2");
    }

    #[tokio::test]
    async fn test_タグ削除できること() {
        let sqlite_pool = setup_test_db().await;

        let tag_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();
        delete_tag_in_db(sqlite_pool.clone(), tag_id).await.unwrap();
        let tags = get_tags_from_db(sqlite_pool.clone()).await.unwrap();
        assert_eq!(tags.len(), 0);
    }

    #[tokio::test]
    async fn test_メモに紐づいたタグを削除したときリレーションテーブルも削除されること() {
        let sqlite_pool = setup_test_db().await;

        sqlx::query("INSERT INTO Folders (name) VALUES (?)")
            .bind("test folder")
            .execute(&sqlite_pool)
            .await
            .unwrap();
        let tag_id = create_tag_in_db(sqlite_pool.clone(), "tag1".to_string())
            .await
            .unwrap();
        let memo_id = create_memo_in_db(
            sqlite_pool.clone(),
            CreateMemoIn {
                title: "memo1".to_string(),
                folder_id: None,
                content: "content1".to_string(),
                tags: Some(vec![tag_id]),
            },
        )
        .await
        .unwrap();

        // タグを削除する前にリレーションの存在を確認
        const SQL: &str =
            "SELECT COUNT(*) as count FROM MemoTagRelations WHERE memo_id = ? AND tag_id = ?";
        let relations = sqlx::query_as::<_, (i64,)>(SQL)
            .bind(memo_id)
            .bind(tag_id)
            .fetch_one(&sqlite_pool)
            .await
            .unwrap();
        assert_eq!(relations.0, 1);

        delete_tag_in_db(sqlite_pool.clone(), tag_id).await.unwrap();

        // タグ削除後にリレーションが削除されていることを確認
        let relations = sqlx::query_as::<_, (i64,)>(SQL)
            .bind(memo_id)
            .bind(tag_id)
            .fetch_one(&sqlite_pool)
            .await
            .unwrap();
        assert_eq!(relations.0, 0);
    }
}
