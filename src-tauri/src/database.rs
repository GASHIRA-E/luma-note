use sqlx::{
    sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous},
    SqlitePool,
};
use std::str::FromStr; // これを追加

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

/// マイグレーションを行う
pub(crate) async fn migrate_database(pool: &SqlitePool) -> DbResult<()> {
    sqlx::migrate!("./src/migrations").run(pool).await?;
    Ok(())
}
