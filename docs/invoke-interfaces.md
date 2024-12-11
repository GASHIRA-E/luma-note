# invokeの定義書

- [domain] Search
  - findFile
- [domain] Folder
  - createFolder
  - deleteFolder
  - updateFolder
  - getFiles ... フォルダ内のファイル一覧
- [domain] File
  - getFile
  - createFile
  - deleteFile
  - updateFile
- [domain] tags
  - getTags
  - createTag
  - deleteTag
- [domain] config
  - getConfig
  - updateConfig

## greet

### 説明

ユーザーに挨拶を返すコマンド。

### パラメータ
| パラメータ名 | データ型 | 必須 | 説明               |
| ------------ | -------- | ---- | ------------------ |
| name         | String   | はい | 挨拶する相手の名前 |

### 戻り値
| データ型 | 説明           |
| -------- | -------------- |
| String   | 挨拶メッセージ |


<details>
  <summary>テンプレート</summary>

  ## 関数名

  ### 説明

  関数の詳細

  ### パラメータ

  | パラメータ名 | データ型 | 必須 | 説明 |
  | ------------ | -------- | ---- | ---- |
  |              |          |      |      |

  ### 戻り値

  | データ型 | 説明 |
  | -------- | ---- |
  |          |      |

</details>