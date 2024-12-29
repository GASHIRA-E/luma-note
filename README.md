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

### データベースの確認

```bash
sqlite3 ~/Library/Application\ Support/gashira-e.com/memos.db
```

```
sqlite> .tables
Folders           Memos             _sqlx_migrations
MemoTagRelations  Tags
sqlite> select * FROM Memos;
1|1|会議メモ|# 2024年第1回プロジェクトミーティング\n\n- 進捗確認\n- 次回の目標設定\n- 課題の共有|2024-12-29 04:53:30|2024-12-29 04:53:30
2|1|タスクリスト|- [ ] レポート作成\n- [ ] 資料準備\n- [x] メール返信|2024-12-29 04:53:30|2024-12-29 04:53:30
3|2|買い物リスト|- 牛乳\n- パン\n- 卵\n- 野菜|2024-12-29 04:53:30|2024-12-29 04:53:30
4|3|アプリアイデア|# メモアプリの新機能案\n\n1. タグ付け機能\n2. 検索機能の強化\n3. カレンダー連携|2024-12-29 04:53:30|2024-12-29 04:53:30
sqlite> select * FROM Folder;
Parse error: no such table: Folder
sqlite> select * FROM Folders;
1|仕事|2024-12-29 04:53:30|2024-12-29 04:53:30
2|プライベート|2024-12-29 04:53:30|2024-12-29 04:53:30
3|アイデア|2024-12-29 04:53:30|2024-12-29 04:53:30
sqlite> .quit
```
