use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct DetailMemoInfo {
    pub id: i64,
    pub title: String,
    pub folder_id: i64,
    pub content: String,
    pub updated_at: String,
    pub tags: Option<Vec<TagInfo>>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct RawDetailMemo {
    // DBから受け取った情報をDetailMemoInfoにパースする前の型
    pub id: i64,
    pub title: String,
    pub content: String,
    pub updated_at: String,
    pub folder_id: i64,
    pub tags: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct CreateMemoIn {
    pub title: String,
    pub folder_id: i64,
    pub content: String,
    pub tags: Option<Vec<i64>>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UpdateMemoIn {
    pub id: i64,
    pub title: Option<String>,
    pub folder_id: Option<i64>,
    pub content: Option<String>,
    pub tags: Option<Vec<i64>>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct MemoListInfo {
    pub id: i64,
    pub title: String,
    pub updated_at: String,
    pub tags: Option<Vec<TagInfo>>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct RawMemoList {
    // DBから受け取った情報をMemoListInfoにパースする前の型
    pub id: i64,
    pub title: String,
    pub updated_at: String,
    pub tags: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow, PartialEq, Eq)]
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
