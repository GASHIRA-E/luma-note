mod commands;
mod database;
mod types;
use commands::folder::{create_folder, delete_folder, get_folders, update_folder};
use commands::memo::{create_memo, delete_memo, get_detail_memo, get_memo_list, update_memo};
use commands::search::find_memo;
use commands::tag::{create_tag, delete_tag, get_tags};
use sqlx::{Pool, Sqlite};
use tauri::Emitter;
use tauri::Manager;
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, ShortcutState};

pub fn db_init(app: &mut tauri::App) -> Result<Pool<Sqlite>, Box<dyn std::error::Error>> {
    use tauri::async_runtime::block_on;
    println!("データベース接続・マイグレーション開始");

    let current_dir: std::path::PathBuf = app.path().app_local_data_dir()?.to_path_buf();
    println!("プロジェクトディレクトリ: {}", current_dir.display());

    // 環境に応じてデータベースパスを生成
    let database_path = database::get_database_path(&current_dir);

    // データベースディレクトリが存在しない場合は作成
    if let Some(parent) = database_path.parent() {
        match std::fs::create_dir_all(parent) {
            Ok(_) => {}
            Err(e) => {
                println!("データベースディレクトリ作成失敗: {}", e);
            }
        }
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

fn register_shortcuts(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    app.global_shortcut().register("CommandOrControl+Shift+9")?;
    app.global_shortcut().register("CommandOrControl+Shift+0")?;
    Ok(())
}

fn handle_shortcut(
    app: &tauri::AppHandle,
    shortcut: &tauri_plugin_global_shortcut::Shortcut,
    event: &tauri_plugin_global_shortcut::ShortcutEvent,
) {
    // フォルダリスト切り替えショートカット
    if shortcut.key == Code::Digit9 && shortcut.mods.contains(Modifiers::SHIFT) {
        match event.state() {
            ShortcutState::Pressed => {
                app.emit("toggle-folder-list", ()).unwrap();
            }
            ShortcutState::Released => {}
        }
    }
    // メモリスト切り替えショートカット
    else if shortcut.key == Code::Digit0 && shortcut.mods.contains(Modifiers::SHIFT) {
        match event.state() {
            ShortcutState::Pressed => {
                app.emit("toggle-memo-list", ()).unwrap();
            }
            ShortcutState::Released => {}
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> Result<(), Box<dyn std::error::Error>> {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(move |app, shortcut, event| {
                    handle_shortcut(app, &shortcut, &event);
                })
                .build(),
        )
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
        .setup(|app| {
            let sqlite_pool = db_init(app)?;
            app.manage(sqlite_pool);

            // グローバルショートカットの登録
            register_shortcuts(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
