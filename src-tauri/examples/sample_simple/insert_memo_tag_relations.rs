use sqlx::{Pool, Sqlite};

pub async fn insert_memo_tag_relations(
    database_url: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    println!("insert_memo_tag_relationsへテストデータの挿入を開始します。");

    let pool = Pool::<Sqlite>::connect(database_url).await?;

    // テストデータの挿入
    sqlx::query("INSERT INTO MemoTagRelations (memo_id, tag_id) VALUES (?, ?), (?, ?), (?, ?)")
        .bind(1)
        .bind(1)
        .bind(2)
        .bind(2)
        .bind(3)
        .bind(3)
        .execute(&pool)
        .await?;

    println!("メモタグリレーションのテストデータを挿入しました。");
    Ok(())
}
