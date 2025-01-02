use crate::types::FolderInfo;
use sqlx::{Pool, Sqlite};

#[tauri::command]
pub async fn get_folders(state: tauri::State<'_, Pool<Sqlite>>) -> Result<Vec<FolderInfo>, ()> {
    let folders = get_folders_from_db(state.inner().clone()).await?;
    Ok(folders)
}

async fn get_folders_from_db(sqlite_pool: Pool<Sqlite>) -> Result<Vec<FolderInfo>, ()> {
    // TODO 各フォルダにあるメモの件数も返す
    const SQL: &str = "SELECT id, name, updated_at FROM Folders";
    let folders = sqlx::query_as::<_, FolderInfo>(SQL)
        .fetch_all(&sqlite_pool)
        .await
        .map_err(|_| ())?;
    Ok(folders)
}

#[tauri::command]
pub async fn create_folder(state: tauri::State<'_, Pool<Sqlite>>, name: String) -> Result<(), ()> {
    let folder = create_folder_in_db(state.inner().clone(), name).await?;
    Ok(folder)
}

async fn create_folder_in_db(sqlite_pool: Pool<Sqlite>, name: String) -> Result<(), ()> {
    //　フォルダ作成内部関数
    const SQL: &str = "INSERT INTO Folders (name) VALUES (?)";
    sqlx::query(SQL)
        .bind(name)
        .execute(&sqlite_pool)
        .await
        .map_err(|_| ())?;
    Ok(())
}

#[tauri::command]
pub async fn delete_folder(state: tauri::State<'_, Pool<Sqlite>>, id: i64) -> Result<(), ()> {
    let folder = delete_folder_in_db(state.inner().clone(), id).await?;
    Ok(folder)
}

async fn delete_folder_in_db(sqlite_pool: Pool<Sqlite>, id: i64) -> Result<(), ()> {
    const SQL: &str = "DELETE FROM Folders WHERE id = ?";
    let result = sqlx::query(SQL)
        .bind(id)
        .execute(&sqlite_pool)
        .await
        .map_err(|_| ())?;

    // 削除された行が0の場合（該当するIDが存在しない場合）はエラーを返す
    if result.rows_affected() == 0 {
        return Err(());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::sqlite::SqlitePoolOptions;

    async fn setup_test_db() -> Pool<Sqlite> {
        // テスト用の一時的なインメモリデータベースを使用
        let sqlite_pool = SqlitePoolOptions::new()
            .connect("sqlite::memory:")
            .await
            .unwrap();

        // テスト用のテーブルを作成
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS Folders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
        )
        .execute(&sqlite_pool)
        .await
        .unwrap();

        sqlite_pool
    }

    #[tokio::test]
    async fn test_フォルダ作成できること() {
        let sqlite_pool = setup_test_db().await;

        // テスト実行
        let name = "test".to_string();
        let result = create_folder_in_db(sqlite_pool.clone(), name).await;
        assert!(result.is_ok());

        // 作成されたデータを確認
        let folder = sqlx::query_as::<_, FolderInfo>("SELECT * FROM Folders WHERE name = ?")
            .bind("test")
            .fetch_one(&sqlite_pool)
            .await
            .unwrap();

        assert_eq!(folder.name, "test");
    }

    #[tokio::test]
    async fn test_フォルダ取得できること() {
        let sqlite_pool = setup_test_db().await;

        create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();
        create_folder_in_db(sqlite_pool.clone(), "test2".to_string())
            .await
            .unwrap();

        let result = get_folders_from_db(sqlite_pool).await;

        assert_eq!(result.unwrap().len(), 2);
    }

    #[tokio::test]
    async fn test_フォルダ削除できること() {
        let sqlite_pool = setup_test_db().await;

        create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        delete_folder_in_db(sqlite_pool.clone(), 1).await.unwrap();

        let result = get_folders_from_db(sqlite_pool).await;
        assert_eq!(result.unwrap().len(), 0);
    }

    #[tokio::test]
    async fn test_存在しないフォルダは削除できないこと() {
        let sqlite_pool = setup_test_db().await;

        let result = delete_folder_in_db(sqlite_pool.clone(), 1).await;
        assert!(result.is_err());
    }
}
