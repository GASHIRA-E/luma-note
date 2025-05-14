# グローバルショートカットの実装手順

## 1. 必要なパッケージのインストール

```bash
# バックエンド（Rust）側
cargo add tauri-plugin-global-shortcut

# フロントエンド（TypeScript）側
npm install @tauri-apps/plugin-global-shortcut
```

## 2. バックエンド側の実装

### 2.1 プラグインの登録

`src-tauri/src/lib.rs`に以下のようにプラグインを登録します：

```rust
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, ShortcutState};

// プラグインの登録
.plugin(
    tauri_plugin_global_shortcut::Builder::new()
        .with_handler(move |app, shortcut, event| {
            handle_shortcut(app, &shortcut, &event);
        })
        .build(),
)
```

### 2.2 ショートカット登録関数の実装

```rust
fn register_shortcuts(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    app.global_shortcut().register("CommandOrControl+Shift+9")?;
    app.global_shortcut().register("CommandOrControl+Shift+0")?;
    Ok(())
}
```

### 2.3 ショートカットハンドラーの実装

```rust
fn handle_shortcut(app: &tauri::AppHandle, shortcut: &tauri_plugin_global_shortcut::Shortcut, event: &tauri_plugin_global_shortcut::ShortcutEvent) {
    // フォルダリスト切り替えショートカット
    if shortcut.key == Code::Digit9 && shortcut.mods.contains(Modifiers::SHIFT) {
        match event.state() {
            ShortcutState::Pressed => {
                app.emit("toggle-folder-list", ()).unwrap();
            }
            ShortcutState::Released => {}
        }
    }
    // メモリスト切り替えショートカット
    else if shortcut.key == Code::Digit0 && shortcut.mods.contains(Modifiers::SHIFT) {
        match event.state() {
            ShortcutState::Pressed => {
                app.emit("toggle-memo-list", ()).unwrap();
            }
            ShortcutState::Released => {}
        }
    }
}
```

### 2.4 アプリケーション起動時のショートカット登録

```rust
.setup(|app| {
    // ... 他のセットアップ処理 ...
    register_shortcuts(app)?;
    Ok(())
})
```

## 3. フロントエンド側の実装

### 3.1 イベントリスナーの設定

```typescript
import { listen } from "@tauri-apps/api/event";

useEffect(() => {
  const unlistenFolderList = listen("toggle-folder-list", () => {
    toggleFolderListVisibility();
  });

  const unlistenMemoList = listen("toggle-memo-list", () => {
    toggleMemoListVisibility();
  });

  return () => {
    unlistenFolderList.then((unlisten) => unlisten());
    unlistenMemoList.then((unlisten) => unlisten());
  };
}, []);
```

### 3.2 ショートカットの登録

```typescript
import { register } from "@tauri-apps/plugin-global-shortcut";

useEffect(() => {
  const setupShortcuts = async () => {
    try {
      await register("CommandOrControl+Shift+9", () => {
        toggleFolderListVisibility();
      });
      
      await register("CommandOrControl+Shift+0", () => {
        toggleMemoListVisibility();
      });
    } catch (error) {
      console.error("ショートカットの登録に失敗しました:", error);
    }
  };
  
  setupShortcuts();
}, []);
```

## 4. ショートカットキーの指定方法

- 修飾キー：
  - `CommandOrControl`: macOSでは`Command`、Windows/Linuxでは`Control`
  - `Shift`
  - `Alt`
  - `Option`（macOSのみ）

- キーコード：
  - 数字キー: `Digit0`～`Digit9`
  - アルファベット: `KeyA`～`KeyZ`
  - ファンクションキー: `F1`～`F12`
  - その他: `Space`, `Enter`, `Escape`など

## 5. 注意事項

1. ショートカットキーの競合に注意
   - システムや他のアプリケーションで使用されているショートカットとの競合を避ける
   - 一般的なショートカット（例：`Cmd+F`）は避ける

2. プラットフォームの違い
   - macOS: `Command`
   - Windows/Linux: `Control`
   - `CommandOrControl`を使用することで、プラットフォームに応じて適切なキーが使用される

3. エラーハンドリング
   - ショートカットの登録に失敗した場合のエラーハンドリングを実装する
   - ユーザーに適切なエラーメッセージを表示する 