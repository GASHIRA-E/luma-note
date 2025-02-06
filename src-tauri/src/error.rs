use serde::{Deserialize, Serialize};
use thiserror::Error;
use typeshare::typeshare;

// ライブラリ用の具体的なエラー型（thiserror）
#[derive(Debug, Error)]
#[allow(dead_code)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(String),

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("System error: {0}")]
    System(String),

    #[error("Unauthorized: {0}")]
    Unauthorized(String),

    #[error(transparent)]
    SqlxError(#[from] sqlx::Error),

    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

// アプリケーション用のエラー型（anyhow）
pub type AppResult<T> = anyhow::Result<T>;

// フロントエンドと共有するエラーコードの定義
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
#[typeshare]
pub enum ErrorCode {
    DatabaseError,
    NotFound,
    ValidationError,
    SystemError,
    Unauthorized,
    UnknownError,
}

// フロントエンドと共有するエラーレスポンスの型
#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[typeshare]
pub struct ErrorResponse {
    /// エラーコード
    pub code: ErrorCode,
    /// エラーメッセージ
    pub message: String,
    /// 詳細情報（開発環境でのみ使用）
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<String>,
}

impl From<anyhow::Error> for ErrorResponse {
    fn from(err: anyhow::Error) -> Self {
        if let Some(app_err) = err.downcast_ref::<AppError>() {
            return app_err.to_response();
        }

        ErrorResponse {
            code: ErrorCode::SystemError,
            message: "システムエラーが発生しました".to_string(),
            details: Some(err.to_string()),
        }
    }
}

impl AppError {
    pub fn to_response(&self) -> ErrorResponse {
        let (code, message) = match self {
            AppError::Database(_) => (ErrorCode::DatabaseError, "データベースエラーが発生しました"),
            AppError::NotFound(_) => (ErrorCode::NotFound, "リソースが見つかりませんでした"),
            AppError::Validation(_) => (ErrorCode::ValidationError, "入力値が不正です"),
            AppError::System(_) => (ErrorCode::SystemError, "システムエラーが発生しました"),
            AppError::Unauthorized(_) => (ErrorCode::Unauthorized, "権限がありません"),
            AppError::SqlxError(_) => {
                (ErrorCode::DatabaseError, "データベースエラーが発生しました")
            }
            AppError::Other(_) => (ErrorCode::SystemError, "システムエラーが発生しました"),
        };

        ErrorResponse {
            code,
            message: message.to_string(),
            details: Some(self.to_string()),
        }
    }
}
