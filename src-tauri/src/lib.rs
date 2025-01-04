mod commands;
mod database;
mod types;
use commands::folder::{create_folder, delete_folder, get_folders, update_folder};
use commands::memo::{create_memo, delete_memo, get_detail_memo, get_memo_list, update_memo};
use commands::search::find_memo;
use commands::tag::{create_tag, delete_tag, get_tags};
use sqlx::{Pool, Sqlite};
use tauri::Manager;

pub fn db_init() -> Result<Pool<Sqlite>, Box<dyn std::error::Error>> {
    use tauri::async_runtime::block_on;

    // プロジェクトのルートディレクトリを取得（src-tauriの親ディレクトリ）
    let current_dir = std::env::current_dir()?
        .parent()
        .ok_or("Cannot get parent directory")?
        .to_path_buf();

    let database_path = current_dir.join("md-memo-light-db").join("db.sqlite");

    // データベースディレクトリが存在しない場合は作成
    if let Some(parent) = database_path.parent() {
        std::fs::create_dir_all(parent)?;
    }

    // パスを文字列に変換（Windows対応）
    let database_url = format!("sqlite:{}", database_path.to_str().ok_or("Invalid path")?);

    println!("データベースパス: {}", database_url);

    // SQLiteのコネクションプールを作成する
    let sqlite_pool = block_on(database::create_sqlite_pool(&database_url))?;

    // マイグレーションの実行
    block_on(async { sqlx::migrate!("../migrations").run(&sqlite_pool).await })?;

    println!("データベース接続・マイグレーション成功");

    Ok(sqlite_pool)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run(sqlite_pool: Pool<Sqlite>) -> Result<(), Box<dyn std::error::Error>> {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_folders,
            create_folder,
            delete_folder,
            update_folder,
            get_memo_list,
            get_detail_memo,
            create_memo,
            delete_memo,
            update_memo,
            create_tag,
            delete_tag,
            get_tags,
            find_memo,
        ])
        // ハンドラからコネクションプールにアクセスできるよう、登録する
        .setup(|app| {
            app.manage(sqlite_pool);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
