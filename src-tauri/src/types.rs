use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct DetailMemoInfo {
    pub id: i64,
    pub title: String,
    pub folder_id: i64,
    pub content: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct MemoInfo {
    pub id: i64,
    pub title: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct MemoListInfo {
    pub id: i64,
    pub title: String,
    pub updated_at: String,
    pub tags: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct TagInfo {
    pub id: i64,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct FolderInfo {
    pub id: i64,
    pub name: String,
    pub updated_at: String,
}
