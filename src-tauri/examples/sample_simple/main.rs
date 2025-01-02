mod insert_folders;
mod insert_memo_tag_relations;
mod insert_memos;
mod insert_tags;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let database_url = "sqlite:../md-memo-light-db/db.sqlite";

    insert_folders::insert_folders(&database_url).await?;
    insert_memos::insert_memos(&database_url).await?;
    insert_tags::insert_tags(&database_url).await?;
    insert_memo_tag_relations::insert_memo_tag_relations(&database_url).await?;
    Ok(())
}
