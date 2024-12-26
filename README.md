# Markdown memo light

マークダウンで軽微なメモを取ることができるアプリケーション

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

## Chakra ui の theme 型を作成

アプリケーション root dir にて実行

```bash
npx @chakra-ui/cli typegen ./src/config/theme.ts
```

## DB

1.  npm run tauri dev
2.  sqlite3 ~/Library/Application\ Support/gashira-e.com/memos.db
