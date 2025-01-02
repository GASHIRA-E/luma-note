use sqlx::{Pool, Sqlite};

pub async fn insert_folders(database_url: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("insert_foldersへテストデータの挿入を開始します。");

    let pool = Pool::<Sqlite>::connect(database_url).await?;
    // テストデータの挿入
    sqlx::query("INSERT INTO Folders (name) VALUES (?), (?), (?)")
        .bind("プログラミング")
        .bind("読書")
        .bind("スポーツ")
        .execute(&pool)
        .await?;

    println!("テストデータを挿入しました。");
    Ok(())
}
