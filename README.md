# Markdown memo light

マークダウンで軽微なメモを取ることができるアプリケーション

## 使用ライブラリ

### フロントエンド

- [react](https://ja.react.dev/)
- [Chakura-ui](https://www.chakra-ui.com/)
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [tanstack query](https://tanstack.com/query/latest)
- [scaffdog](https://scaff.dog/)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## setup

Template created! To get started run:

```bash
  npm install
  # npm run tauri android init
  # npm run tauri ios init
```

## build commands

For Desktop development, run:

```bash
  npm run tauri dev
```

For Android development, run:

```bash
  npm run tauri android dev
```

For iOS development, run:

```bash
  npm run tauri ios dev
```

## フロントエンド Tips

### ディレクトリ構成

root: src

| ディレクトリ           | 内容・目的                                                                                               |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| component/container    | container presentation パターンの container. 動作を司る。<br/>大きな機能を持ったコンポーネントを配置する |
| component/presentation | container presentation パターンの presentation. 表示を司る。                                             |
| component/parts        | 小さなパーツを配置する。                                                                                 |
| components/ui          | chakra-ui で出力されたファイル。基本的に手動では編集しない。                                             |
| config                 | 色々な設定を配置するファイル。                                                                           |
| utils/invoke           | invoke を呼び出すためのファイル。型定義などを行う。                                                      |
| utils/invoke/\_mock    | フロントのみ起動していても動作確認ができるように mock データを作成する。                                 |
| utils/stores           | zustand の定義ファイルを記載する。                                                                       |

### Chakra ui の theme 型を作成

アプリケーション root dir にて実行

```bash
npx @chakra-ui/cli typegen ./src/config/theme.ts
```

### scaffdog

土台となるファイルを作成するためのコマンド
invoke の雛形や zustand の store の雛形を作成する

```bash
npx scaffdog generate
```

## バックエンド Tips

### データベースの設定

1. sqlx-cli のインストール:

```bash
cargo install sqlx-cli
```

2. プロジェクトルートに`.env`ファイルを作成:

```bash
# .envファイルを作成
touch .env

# .envファイルに以下の内容を追加
echo "DATABASE_URL=sqlite:md-memo-light-db/db.sqlite" > .env

# .gitignoreに.envを追加（既に追加されている場合は不要）
echo ".env" >> .gitignore
```

3. データベースディレクトリの作成:

```bash
mkdir -p md-memo-light-db
```

4. データベースの作成:

```bash
sqlx database create
```

5. マイグレーションの実行:

```bash
sqlx migrate run
```

#### 注意事項

- `.env`ファイルはバージョン管理対象外です
- 開発環境とプロダクション環境で異なるデータベース URL を使用する場合は、環境変数で上書きできます
- Windows 環境では、パスの区切り文字に注意してください：
  ```env
  DATABASE_URL=sqlite:md-memo-light-db\db.sqlite
  ```

### データベースの確認

データベースのテーブルを確認する:

```bash
sqlite3 ./md-memo-light-db/db.sqlite
```

テーブルの確認:

```sql
sqlite> .tables
Folders           Memos             _sqlx_migrations
MemoTagRelations  Tags

sqlite> select * FROM Folders;
仕事|2024-12-30 06:42:12|2024-12-30 06:42:12
プライベート|2024-12-30 06:42:12|2024-12-30 06:42:12
アイデア|2024-12-30 06:42:12|2024-12-30 06:42:12
その他|2024-12-30 06:42:12|2024-12-30 06:42:12

sqlite> .quit
```

### マイグレーションの管理

1. 新しいマイグレーションファイルの作成:

```bash
# マイグレーションファイルを作成
sqlx migrate add <マイグレーション名>

# 例: テーブル作成のマイグレーション
sqlx migrate add create_users_table

# 作成されるファイル:
# - migrations/{timestamp}_create_users_table.up.sql
# - migrations/{timestamp}_create_users_table.down.sql
```

2. マイグレーションの実行（アップグレード）:

```bash
# 全てのマイグレーションを実行
sqlx migrate run

# 特定のバージョンまでマイグレーション
sqlx migrate run --target-version <version>
```

3. マイグレーションの巻き戻し（ダウングレード）:

```bash
# 直前のマイグレーションを巻き戻し
sqlx migrate revert

# 全てのマイグレーションを巻き戻し
sqlx migrate revert --target-version 0
```

4. マイグレーション状態の確認:

```bash
# 現在のマイグレーション状態を確認
sqlite3 ./md-memo-light-db/db.sqlite "SELECT * FROM _sqlx_migrations ORDER BY version;"
```

### マイグレーションファイルの書き方

1. アップグレード用 SQL（example.up.sql）:

```sql
-- テーブルの作成
CREATE TABLE IF NOT EXISTS example (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初期データの投入
INSERT INTO example (name) VALUES ('テストデータ');
```

2. ダウングレード用 SQL（example.down.sql）:

```sql
-- テーブルの削除
DROP TABLE IF EXISTS example;
```

### 注意事項

- マイグレーションファイルは一度作成したら変更しないでください
- 変更が必要な場合は、新しいマイグレーションファイルを作成します
- マイグレーションファイルはバージョン管理に含めてください
- `.up.sql`と`.down.sql`は必ずペアで作成してください

### マイグレーションのやり直し

```sh
sqlx database reset  # データベースを再作成
sqlx migrate run     # マイグレーションを実行
```
