use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use typeshare::typeshare;

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[typeshare]
pub struct DetailMemoInfo {
    /// メモID  
    pub id: i32,
    /// メモタイトル
    pub title: String,
    /// メモフォルダID
    pub folder_id: i32,
    /// メモ内容
    pub content: String,
    /// メモ更新日時
    pub updated_at: String,
    /// メモタグ
    pub tags: Option<Vec<TagInfo>>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[typeshare]
/// DBから受け取った情報をDetailMemoInfoにパースする前の型(バックエンドのみ利用)
pub struct RawDetailMemo {
    /// メモID
    pub id: i32,
    /// メモタイトル
    pub title: String,
    /// メモ内容
    pub content: String,
    /// メモ更新日時
    pub updated_at: String,
    /// メモフォルダID
    pub folder_id: i32,
    /// メモタグ
    pub tags: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[typeshare]
pub struct CreateMemoIn {
    /// メモタイトル
    pub title: String,
    /// メモフォルダID
    pub folder_id: i32,
    /// メモ内容
    pub content: String,
    /// メモタグ
    pub tags: Option<Vec<i32>>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[typeshare]
pub struct UpdateMemoIn {
    /// メモID
    pub id: i32,
    /// メモタイトル
    pub title: Option<String>,
    /// メモフォルダID
    pub folder_id: Option<i32>,
    /// メモ内容
    pub content: Option<String>,
    /// メモタグ
    pub tags: Option<Vec<i32>>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[typeshare]
pub struct MemoListInfo {
    /// メモID
    pub id: i32,
    /// メモタイトル
    pub title: String,
    /// メモ更新日時
    pub updated_at: String,
    /// メモタグ
    pub tags: Option<Vec<TagInfo>>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[typeshare]
/// DBから受け取った情報をMemoListInfoにパースする前の型(バックエンドのみ利用)
pub struct RawMemoList {
    /// メモID
    pub id: i32,
    /// メモタイトル
    pub title: String,
    /// メモ更新日時
    pub updated_at: String,
    /// メモタグ
    pub tags: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow, PartialEq, Eq)]
#[typeshare]
pub struct TagInfo {
    /// タグID
    pub id: i32,
    /// タグ名
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[typeshare]
pub struct FolderInfo {
    /// フォルダID
    pub id: i32,
    /// フォルダ名
    pub name: String,
    /// フォルダ更新日時
    pub updated_at: String,
}
