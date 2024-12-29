use serde::{Deserialize, Serialize};
mod database;
use sqlx::FromRow;
use sqlx::Pool;
use sqlx::Sqlite;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
struct FolderInfo {
    id: i64,
    name: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct DetailMemoInfo {
    id: i64,
    title: String,
    folder_id: i64,
    content: String,
    updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct MemoInfo {
    id: i64,
    name: String,
    updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct MemoListInfo {
    id: i64,
    name: String,
    updated_at: String,
    tags: Vec<TagInfo>,
}

#[derive(Debug, Serialize, Deserialize)]
struct TagInfo {
    id: i64,
    name: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Folder {
    id: i64,
    name: String,
    updated_at: String,
}

pub fn db_init() -> Result<Pool<Sqlite>, Box<dyn std::error::Error>> {
    use tauri::async_runtime::block_on;
    // データベースのファイルパス等を設定する
    const DATABASE_DIR: &str = "md-memo-light-db";
    const DATABASE_FILE: &str = "db.sqlite";
    let home_dir = directories::UserDirs::new()
        .map(|dirs| dirs.home_dir().to_path_buf())
        // ホームディレクトリが取得できないときはカレントディレクトリを使う
        .unwrap_or_else(|| std::env::current_dir().expect("Cannot access the current directory"));
    let database_dir = home_dir.join(DATABASE_DIR);
    let database_file = database_dir.join(DATABASE_FILE);

    // データベースファイルが存在するかチェックする
    let db_exists = std::fs::metadata(&database_file).is_ok();
    // 存在しないなら、ファイルを格納するためのディレクトリを作成する
    if !db_exists {
        std::fs::create_dir(&database_dir)?;
    }

    let database_dir_str = dunce::canonicalize(&database_dir)
        .unwrap()
        .to_string_lossy()
        .replace('\\', "/");
    let database_url = format!("sqlite://{}/{}", database_dir_str, DATABASE_FILE);

    // SQLiteのコネクションプールを作成する
    let sqlite_pool = block_on(database::create_sqlite_pool(&database_url))?;

    //  データベースファイルが存在しなかったなら、マイグレーションSQLを実行する
    if !db_exists {
        block_on(database::migrate_database(&sqlite_pool))?;
    }

    Ok(sqlite_pool)
}

#[tauri::command]
async fn get_folders(state: tauri::State<'_, Pool<Sqlite>>) -> Result<Vec<Folder>, ()> {
    let folders = get_folders_from_db(state.inner().clone()).await?;
    Ok(folders)
}

async fn get_folders_from_db(sqlite_pool: Pool<Sqlite>) -> Result<Vec<Folder>, ()> {
    const SQL: &str = "SELECT * FROM Folders";
    let folders = sqlx::query_as::<_, Folder>(SQL)
        .fetch_all(&sqlite_pool)
        .await
        .map_err(|_| ())?;
    Ok(folders)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run(sqlite_pool: Pool<Sqlite>) -> Result<(), Box<dyn std::error::Error>> {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_folders])
        // ハンドラからコネクションプールにアクセスできるよう、登録する
        .setup(|app| {
            app.manage(sqlite_pool);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
