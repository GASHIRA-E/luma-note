use serde::Serialize;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Serialize)]
struct Folder {
    id: i64,
    name: String,
    updated_at: String,
}

#[tauri::command]
fn get_folders() -> Result<Vec<Folder>, ()> {
    let mut folders = vec![];
    // フォルダ一覧のモック取得処理
    let mock_folders = [
        "rust mock folder 1",
        "rust mock folder 2",
        "rust mock folder 3",
    ];
    let mut mock_id = 1;
    for mock_folder in mock_folders {
        folders.push(Folder {
            id: mock_id,
            name: mock_folder.to_string(),
            updated_at: "2021-09-01 20:00".to_string(),
        });
        mock_id += 1;
    }
    Ok(folders)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, get_folders])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
