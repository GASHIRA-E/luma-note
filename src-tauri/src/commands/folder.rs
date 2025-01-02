use crate::types::FolderInfo;
use sqlx::{Pool, Sqlite};

#[tauri::command]
pub async fn get_folders(state: tauri::State<'_, Pool<Sqlite>>) -> Result<Vec<FolderInfo>, ()> {
    let folders = get_folders_from_db(state.inner().clone()).await?;
    Ok(folders)
}

async fn get_folders_from_db(sqlite_pool: Pool<Sqlite>) -> Result<Vec<FolderInfo>, ()> {
    const SQL: &str = "SELECT * FROM Folders";
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

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::sqlite::SqlitePoolOptions;

    #[tokio::test]
    async fn test_フォルダ作成できること() {
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
}
