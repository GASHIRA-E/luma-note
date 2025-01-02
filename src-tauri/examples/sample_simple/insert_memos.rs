use sqlx::{Pool, Sqlite};

pub async fn insert_memos(database_url: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("insert_memosへテストデータの挿入を開始します。");

    let pool = Pool::<Sqlite>::connect(database_url).await?;

    // テストデータの挿入
    sqlx::query(
        "INSERT INTO Memos (folder_id, title, content) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)",
    )
    // 一つ目
    .bind(1)
    .bind("Rustの勉強")
    .bind("Rustの基本を学ぶ")
    // 二つ目
    .bind(2)
    .bind("読書メモ")
    .bind("最近読んだ本の感想")
    // 三つ目
    .bind(3)
    .bind("スポーツメモ")
    .bind("週末のサッカー試合の予定")
    .execute(&pool)
    .await?;

    println!("メモのテストデータを挿入しました。");
    Ok(())
}
