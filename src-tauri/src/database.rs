use sqlx::{
    sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous},
    SqlitePool,
};
use std::str::FromStr;

/// このモジュール内の関数の戻り値型
type DbResult<T> = Result<T, Box<dyn std::error::Error>>;

/// SQLiteのコネクションプールを作成して返す
pub(crate) async fn create_sqlite_pool(database_url: &str) -> DbResult<SqlitePool> {
    // コネクションの設定
    let connection_options = SqliteConnectOptions::from_str(database_url)?
        // DBが存在しないなら作成する
        .create_if_missing(true)
        // トランザクション使用時の性能向上のため、WALを使用する
        .journal_mode(SqliteJournalMode::Wal)
        .synchronous(SqliteSynchronous::Normal);

    // 上の設定を使ってコネクションプールを作成する
    let sqlite_pool = SqlitePoolOptions::new()
        .connect_with(connection_options)
        .await?;

    Ok(sqlite_pool)
}

#[cfg(test)]
use sqlx::{Pool, Sqlite};

#[cfg(test)]
/// テスト用DB構築
pub async fn setup_test_db() -> Pool<Sqlite> {
    let sqlite_pool = SqlitePoolOptions::new()
        .connect("sqlite::memory:")
        .await
        .unwrap();

    // テーブル作成
    create_tables(&sqlite_pool).await;

    sqlite_pool
}
#[cfg(test)]
/// migrationファイルを読み込んでテーブル作成
async fn create_tables(pool: &Pool<Sqlite>) {
    let sql = include_str!("../../migrations/0001_init_tables.up.sql");
    sqlx::query(sql).execute(pool).await.unwrap();
}

/// DBのパスを環境に応じて生成する
pub(crate) fn get_database_path(app_dir: &std::path::Path) -> std::path::PathBuf {
    // Cargoのプロファイルから開発環境かどうかを判断
    let is_debug = cfg!(debug_assertions);

    println!(
        "実行環境: {}",
        if is_debug {
            "開発環境"
        } else {
            "本番環境"
        }
    );

    let db_name = if is_debug {
        "md-memo-light-db-dev"
    } else {
        "md-memo-light-db"
    };

    app_dir.join(db_name).join("db.sqlite")
}
