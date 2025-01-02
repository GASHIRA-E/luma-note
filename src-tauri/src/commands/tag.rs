use sqlx::{Pool, Sqlite};

pub async fn create_tag_in_db(sqlite_pool: Pool<Sqlite>, name: String) -> Result<i64, ()> {
    let tag = sqlx::query("INSERT INTO Tags (name) VALUES (?)")
        .bind(name)
        .execute(&sqlite_pool)
        .await
        .unwrap();
    Ok(tag.rows_affected() as i64)
}
