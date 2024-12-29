CREATE TABLE IF NOT EXISTS Memos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    folder_id INTEGER DEFAULT 0, -- folderID=0:フォルダ未選択
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Folders(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS MemoTagRelations (
    memo_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (memo_id, tag_id),
    FOREIGN KEY (memo_id) REFERENCES Memos(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(id) ON DELETE CASCADE
);

-- テストデータの挿入
INSERT INTO Folders (name) VALUES 
    ('仕事'),
    ('プライベート'),
    ('アイデア');

INSERT INTO Memos (folder_id, title, content) VALUES
    (1, '会議メモ', '# 2024年第1回プロジェクトミーティング\n\n- 進捗確認\n- 次回の目標設定\n- 課題の共有'),
    (1, 'タスクリスト', '- [ ] レポート作成\n- [ ] 資料準備\n- [x] メール返信'),
    (2, '買い物リスト', '- 牛乳\n- パン\n- 卵\n- 野菜'),
    (3, 'アプリアイデア', '# メモアプリの新機能案\n\n1. タグ付け機能\n2. 検索機能の強化\n3. カレンダー連携');

INSERT INTO Tags (name) VALUES
    ('重要'),
    ('仕事'),
    ('買い物'),
    ('アイデア'),
    ('TODO');

INSERT INTO MemoTagRelations (memo_id, tag_id) VALUES
    (1, 1),  -- 会議メモ: 重要
    (1, 2),  -- 会議メモ: 仕事
    (2, 2),  -- タスクリスト: 仕事
    (2, 5),  -- タスクリスト: TODO
    (3, 3),  -- 買い物リスト: 買い物
    (4, 4);  -- アプリアイデア: アイデア