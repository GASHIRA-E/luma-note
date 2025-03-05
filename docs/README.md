# 開発者ドキュメント

## 使用ライブラリ

### フロントエンド

- [react](https://ja.react.dev/)
- [Chakura-ui](https://www.chakra-ui.com/)
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [tanstack query](https://tanstack.com/query/latest)
- [scaffdog](https://scaff.dog/)

- [react-md-editor](https://github.com/uiwjs/react-md-editor)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## setup

Template created! To get started run:

```bash
  npm install
```

## build commands

For Desktop development, run:

```bash
  npm run tauri dev
```

## フロントエンド Tips

### npm scripts

| command                | 目的                                    |
|-----------------------|----------------------------------------|
| `npm run web`         | Mock を使用してフロントを起動する           |
| `npm run tauri dev`   | 開発用DBで tauri アプリを起動する          |
| `npm run tauri:prod dev` | 本番用DBで tauri アプリを起動する（動作確認用） |
| `npm run tauri build` | 本番用アプリケーションをビルドする（本番DB使用） |

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

### typeshare で ts 型定義ファイルを生成

```bash
cargo install typeshare-cli
```

下記コマンドで src-tauri/src/types.rs から src/types/invokeGenerate.d.ts へ変換する

```bash
make typeshare
```

### データベースの設定

1. sqlx-cli のインストール:

```bash
cargo install sqlx-cli
```

2. データベースの作成:

```bash
sqlx database create --database-url "sqlite:md-memo-light-db/db.sqlite"
```

3. マイグレーションの実行:

```bash
sqlx migrate run --database-url "sqlite:md-memo-light-db/db.sqlite"
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
sqlx migrate add -r <マイグレーション名>

# 例: テーブル作成のマイグレーション
sqlx migrate add -r create_users_table

# 作成されるファイル:
# - migrations/{timestamp}_create_users_table.up.sql
# - migrations/{timestamp}_create_users_table.down.sql
```

2. マイグレーションの実行（アップグレード）:

```bash
# 全てのマイグレーションを実行
sqlx migrate run --database-url "sqlite:md-memo-light-db/db.sqlite"

# 特定のバージョンまでマイグレーション
sqlx migrate run --target-version <version> --database-url "sqlite:md-memo-light-db/db.sqlite"
```

3. マイグレーションの巻き戻し（ダウングレード）:

```bash
# 直前のマイグレーションを巻き戻し
sqlx migrate revert --database-url "sqlite:md-memo-light-db/db.sqlite"

# 全てのマイグレーションを巻き戻し
sqlx migrate revert --target-version 0 --database-url "sqlite:md-memo-light-db/db.sqlite"
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
sqlx database reset --database-url "sqlite:md-memo-light-db/db.sqlite"  # データベースを再作成
sqlx migrate run --database-url "sqlite:md-memo-light-db/db.sqlite"     # マイグレーションを実行
```

### サンプルデータの挿入

※事前にデータを削除してから実行した方が良いです。

```bash
cd src-tauri
cargo run --example [example対象]
```

作成している example フォルダ

- `sample_simple`
  - `cargo run --example sample_simple`
  - シンプルなデータを追加する

## 環境分けについて

アプリケーションは開発環境と本番環境で異なるデータベースを使用します：

### データベースの環境分け

- 開発環境
  - 保存場所: `{app_local_data_dir}/md-memo-light-db-dev/db.sqlite`
  - 使用コマンド: `npm run tauri dev`
  - 開発やテスト用のデータを保存

- 本番環境
  - 保存場所: `{app_local_data_dir}/md-memo-light-db/db.sqlite`
  - 使用コマンド: `npm run tauri:prod dev`（動作確認用）
  - ビルド版でも使用
  - 実際の利用データを保存

※ `{app_local_data_dir}` は OS によって異なります：
- Windows: `C:\Users\{ユーザー名}\AppData\Local\{アプリ名}`
- macOS: `~/Library/Application Support/{アプリ名}`
- Linux: `~/.local/share/{アプリ名}`

### ビルド生成物

`npm run tauri build` を実行すると、本番用アプリケーションがビルドされます（`md-memo-light-db/db.sqlite`を使用）。
ビルド生成物は以下の場所に作成されます：

```
src-tauri/target/release/bundle/
```

各OS向けのインストーラー：
- Windows: `src-tauri/target/release/bundle/msi/` (.msi)
- macOS: `src-tauri/target/release/bundle/dmg/` (.dmg)
- Linux: `src-tauri/target/release/bundle/deb/` (.deb)

実行可能ファイル：
- Windows: `src-tauri/target/release/luma-note.exe`
- macOS/Linux: `src-tauri/target/release/luma-note`
