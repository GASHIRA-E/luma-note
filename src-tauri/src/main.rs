// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("start main");
    // let sqlite_pool = md_memo_light_lib::db_init()?;
    // md_memo_light_lib::run(sqlite_pool)?;
    md_memo_light_lib::run()?;
    Ok(())
}
