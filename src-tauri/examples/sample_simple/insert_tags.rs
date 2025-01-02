use sqlx::{Pool, Sqlite};

pub async fn insert_tags(database_url: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("insert_tagsへテストデータの挿入を開始します。");

    let pool = Pool::<Sqlite>::connect(database_url).await?;

    // テストデータの挿入
    sqlx::query("INSERT INTO Tags (name) VALUES (?), (?), (?)")
        .bind("Rust")
        .bind("読書")
        .bind("スポーツ")
        .execute(&pool)
        .await?;

    println!("タグのテストデータを挿入しました。");
    Ok(())
}
