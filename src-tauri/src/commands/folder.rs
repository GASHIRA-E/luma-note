use crate::types::FolderInfo;
use sqlx::{Pool, Sqlite};
#[tauri::command]
pub async fn get_folders(state: tauri::State<'_, Pool<Sqlite>>) -> Result<Vec<FolderInfo>, ()> {
    let folders = get_folders_from_db(state.inner().clone()).await?;
    Ok(folders)
}

async fn get_folders_from_db(sqlite_pool: Pool<Sqlite>) -> Result<Vec<FolderInfo>, ()> {
    const SQL: &str = "
        SELECT 
            f.id,
            f.name,
            f.updated_at,
            COUNT(m.id) as memo_count
        FROM Folders f
        LEFT JOIN Memos m ON f.id = m.folder_id 
        GROUP BY f.id, f.name, f.updated_at
    ";
    let folders = sqlx::query_as::<_, FolderInfo>(SQL)
        .fetch_all(&sqlite_pool)
        .await
        .map_err(|_| ())?;
    Ok(folders)
}

#[tauri::command]
pub async fn create_folder(state: tauri::State<'_, Pool<Sqlite>>, name: String) -> Result<i32, ()> {
    let folder_id = create_folder_in_db(state.inner().clone(), name).await?;
    Ok(folder_id)
}

pub async fn create_folder_in_db(sqlite_pool: Pool<Sqlite>, name: String) -> Result<i32, ()> {
    //　フォルダ作成内部関数
    const SQL: &str = "INSERT INTO Folders (name) VALUES (?)";
    let result = sqlx::query(SQL)
        .bind(name)
        .execute(&sqlite_pool)
        .await
        .map_err(|_| ())?;
    // 作成されたフォルダのIDを返す
    Ok(result.last_insert_rowid() as i32)
}

#[tauri::command]
pub async fn delete_folder(
    state: tauri::State<'_, Pool<Sqlite>>,
    folder_id: i32,
    remove_relation_memo: bool,
) -> Result<(), ()> {
    // folder_id=NULL(フォルダ未指定)は削除しない
    delete_folder_in_db(state.inner().clone(), folder_id, remove_relation_memo).await?;
    Ok(())
}

async fn delete_folder_in_db(
    sqlite_pool: Pool<Sqlite>,
    folder_id: i32,
    remove_relation_memo: bool,
) -> Result<(), ()> {
    if !remove_relation_memo {
        // フォルダに紐づいたメモのフォルダIDをNULLにする
        const UPDATE_FOLDER_ID_SQL: &str = "UPDATE Memos SET folder_id = NULL WHERE folder_id = ?";
        sqlx::query(UPDATE_FOLDER_ID_SQL)
            .bind(folder_id)
            .execute(&sqlite_pool)
            .await
            .map_err(|_| ())?;
    }

    // フォルダを削除する
    const DELETE_FOLDER_SQL: &str = "DELETE FROM Folders WHERE id = ?";
    let result = sqlx::query(DELETE_FOLDER_SQL)
        .bind(folder_id)
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
pub async fn update_folder(
    state: tauri::State<'_, Pool<Sqlite>>,
    folder_id: i32,
    name: String,
) -> Result<(), ()> {
    // folder_id=NULL(フォルダ未指定)は更新しない
    update_folder_in_db(state.inner().clone(), folder_id, name).await?;
    Ok(())
}

async fn update_folder_in_db(
    sqlite_pool: Pool<Sqlite>,
    folder_id: i32,
    name: String,
) -> Result<(), ()> {
    const SQL: &str = "UPDATE Folders SET name = ? WHERE id = ?";
    sqlx::query(SQL)
        .bind(name)
        .bind(folder_id)
        .execute(&sqlite_pool)
        .await
        .map_err(|_| ())?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::commands::memo::create_memo_in_db;
    use crate::commands::memo::get_memo_list_from_db;
    use crate::database::setup_test_db;
    use crate::types::CreateMemoIn;
    use crate::types::NullableId;

    #[tokio::test]
    async fn test_フォルダ作成できること() {
        let sqlite_pool = setup_test_db().await;

        // テスト実行
        let name = "test".to_string();
        let result = create_folder_in_db(sqlite_pool.clone(), name).await;
        assert!(result.is_ok());

        // 作成されたデータを確認
        let folder = sqlx::query_as::<_, FolderInfo>(
            "
            SELECT 
                f.id,
                f.name,
                f.updated_at,
                COUNT(m.id) as memo_count
            FROM Folders f
            LEFT JOIN Memos m ON f.id = m.folder_id 
            WHERE f.name = ?
            GROUP BY f.id, f.name, f.updated_at
        ",
        )
        .bind("test")
        .fetch_one(&sqlite_pool)
        .await
        .unwrap();

        assert_eq!(result.unwrap(), 1);
        assert_eq!(folder.name, "test");
        assert_eq!(folder.memo_count, 0);
    }

    #[tokio::test]
    async fn test_フォルダ取得できること() {
        let sqlite_pool = setup_test_db().await;

        // フォルダを2つ作成
        create_folder_in_db(sqlite_pool.clone(), "test1".to_string())
            .await
            .unwrap();
        create_folder_in_db(sqlite_pool.clone(), "test2".to_string())
            .await
            .unwrap();

        let result = get_folders_from_db(sqlite_pool).await;
        let folders = result.unwrap();

        assert_eq!(folders.len(), 2);
        assert_eq!(folders[0].name, "test1");
        assert_eq!(folders[0].memo_count, 0);
        assert_eq!(folders[1].name, "test2");
        assert_eq!(folders[1].memo_count, 0);
    }

    #[tokio::test]
    async fn test_フォルダ内のメモ件数が正しく取得できること() {
        let sqlite_pool = setup_test_db().await;

        // フォルダを2つ作成
        let folder1_id = create_folder_in_db(sqlite_pool.clone(), "test1".to_string())
            .await
            .unwrap();
        let folder2_id = create_folder_in_db(sqlite_pool.clone(), "test2".to_string())
            .await
            .unwrap();

        // folder1に2つのメモを作成
        let create_memo_in1 = CreateMemoIn {
            title: "memo1".to_string(),
            content: "content1".to_string(),
            folder_id: Some(NullableId::Value(folder1_id)),
            tags: None,
        };
        create_memo_in_db(sqlite_pool.clone(), create_memo_in1.clone())
            .await
            .unwrap();
        create_memo_in_db(sqlite_pool.clone(), create_memo_in1.clone())
            .await
            .unwrap();

        // folder2に1つのメモを作成
        let create_memo_in2 = CreateMemoIn {
            title: "memo2".to_string(),
            content: "content2".to_string(),
            folder_id: Some(NullableId::Value(folder2_id)),
            tags: None,
        };
        create_memo_in_db(sqlite_pool.clone(), create_memo_in2)
            .await
            .unwrap();

        let result = get_folders_from_db(sqlite_pool).await;
        let folders = result.unwrap();

        assert_eq!(folders.len(), 2);
        // folder1の確認
        let folder1 = folders.iter().find(|f| f.id == folder1_id).unwrap();
        assert_eq!(folder1.name, "test1");
        assert_eq!(folder1.memo_count, 2);

        // folder2の確認
        let folder2 = folders.iter().find(|f| f.id == folder2_id).unwrap();
        assert_eq!(folder2.name, "test2");
        assert_eq!(folder2.memo_count, 1);
    }

    #[tokio::test]
    async fn test_フォルダ削除できること() {
        let sqlite_pool = setup_test_db().await;

        let folder_id = create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        delete_folder_in_db(sqlite_pool.clone(), folder_id, false)
            .await
            .unwrap();

        let result = get_folders_from_db(sqlite_pool).await;
        assert_eq!(result.unwrap().len(), 0);
    }

    #[tokio::test]
    async fn test_存在しないフォルダは削除できないこと() {
        let sqlite_pool = setup_test_db().await;

        let result = delete_folder_in_db(sqlite_pool.clone(), 99, false).await;
        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_紐づいているメモを削除しない場合はメモのfolder_idがnullになること() {
        let sqlite_pool = setup_test_db().await;

        let folder_id = create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        let create_memo_in = CreateMemoIn {
            title: "test".to_string(),
            content: "test".to_string(),
            folder_id: Some(NullableId::Value(folder_id)),
            tags: None,
        };

        let memo1_id = create_memo_in_db(sqlite_pool.clone(), create_memo_in.clone())
            .await
            .unwrap();
        let memo2_id = create_memo_in_db(sqlite_pool.clone(), create_memo_in.clone())
            .await
            .unwrap();

        let before_folder = get_folders_from_db(sqlite_pool.clone()).await.unwrap();
        assert_eq!(before_folder.len(), 1);

        delete_folder_in_db(sqlite_pool.clone(), folder_id, false)
            .await
            .unwrap();

        let after_folder = get_folders_from_db(sqlite_pool.clone()).await.unwrap();
        assert_eq!(after_folder.len(), 0);

        let memos = get_memo_list_from_db(sqlite_pool.clone(), None)
            .await
            .unwrap();
        assert_eq!(memos.len(), 2);
        assert_eq!(memos[0].id, memo1_id);
        assert_eq!(memos[1].id, memo2_id);
    }

    #[tokio::test]
    async fn test_フラグがtrueの場合はフォルダに紐づいているメモも削除されること() {
        let sqlite_pool = setup_test_db().await;

        let folder_id = create_folder_in_db(sqlite_pool.clone(), "test".to_string())
            .await
            .unwrap();

        let create_memo_in = CreateMemoIn {
            title: "test".to_string(),
            content: "test".to_string(),
            folder_id: Some(NullableId::Value(folder_id)),
            tags: None,
        };

        create_memo_in_db(sqlite_pool.clone(), create_memo_in.clone())
            .await
            .unwrap();
        create_memo_in_db(sqlite_pool.clone(), create_memo_in.clone())
            .await
            .unwrap();

        let before_folder = get_folders_from_db(sqlite_pool.clone()).await.unwrap();
        assert_eq!(before_folder.len(), 1);
        let before_memos = get_memo_list_from_db(sqlite_pool.clone(), Some(folder_id))
            .await
            .unwrap();
        assert_eq!(before_memos.len(), 2);

        // フォルダに紐づいているメモも削除する
        delete_folder_in_db(sqlite_pool.clone(), folder_id, true)
            .await
            .unwrap();

        let after_folder = get_folders_from_db(sqlite_pool.clone()).await.unwrap();
        assert_eq!(after_folder.len(), 0);

        let memos = get_memo_list_from_db(sqlite_pool.clone(), None)
            .await
            .unwrap();
        assert_eq!(memos.len(), 0);
    }
}
