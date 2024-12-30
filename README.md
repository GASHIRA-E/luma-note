# Markdown memo light

マークダウンで軽微なメモを取ることができるアプリケーション

## 使用ライブラリ

### フロントエンド

- [react](https://ja.react.dev/)
- [Chakura-ui](https://www.chakra-ui.com/)
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [tanstack query](https://tanstack.com/query/latest)
- [scaffdog](https://scaff.dog/)

#### エディタ周りのライブラリ

- [marked](https://marked.js.org/)
  - markdownテキストからhtmlテキストへ変換を行うため
- [highlight.js](https://highlightjs.org/)
  - コード関連のハイライトを行うため

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

### npm scripts

| command             | 目的                             |
| ------------------- | -------------------------------- |
| `npm run web`       | Mockを使用してフロントを起動する |
| `npm run tauri dev` | tauriアプリを起動する            |

### ディレクトリ構成

root: src

| ディレクトリ           | 内容・目的                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| component/container    | container presentationパターンのcontainer. 動作を司る。<br/>大きな機能を持ったコンポーネントを配置する |
| component/presentation | container presentationパターンのpresentation. 表示を司る。                                             |
| component/parts        | 小さなパーツを配置する。                                                                               |
| components/ui          | chakra-uiで出力されたファイル。基本的に手動では編集しない。                                            |
| config                 | 色々な設定を配置するファイル。                                                                         |
| utils/invoke           | invokeを呼び出すためのファイル。型定義などを行う。                                                     |
| utils/invoke/_mock     | フロントのみ起動していても動作確認ができるようにmockデータを作成する。                                 |
| utils/stores           | zustandの定義ファイルを記載する。                                                                      |


### Chakra ui の theme型を作成

アプリケーションroot dir にて実行

```bash
npx @chakra-ui/cli typegen ./src/config/theme.ts
```

### scaffdog

土台となるファイルを作成するためのコマンド
invokeの雛形やzustandのstoreの雛形を作成する

```bash
npx scaffdog generate
```