import "./App.css";
import { useState, useEffect } from "react";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { listen } from "@tauri-apps/api/event";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { AppSettingProvider } from "@/components/context/AppSettingContext";

import { FolderList } from "@/components/container/FolderList";
import { MemoListContainer } from "@/components/container/MemoList";
import { EditArea } from "@/components/container/EditArea";
import { HeaderContainer } from "@/components/container/Header";
import { ConfigMenuContainer } from "@/components/container/ConfigMenu";

const queryClient = new QueryClient();

function App() {
  const [isFolderListVisible, setIsFolderListVisible] = useState(true);
  const [isMemoListVisible, setIsMemoListVisible] = useState(true);

  const toggleFolderListVisibility = () => {
    setIsFolderListVisible((prev) => !prev);
  };

  const toggleMemoListVisibility = () => {
    setIsMemoListVisible((prev) => !prev);
  };

  // バックエンドからのイベントをリッスン
  useEffect(() => {
    const unlistenFolderList = listen("toggle-folder-list", () => {
      toggleFolderListVisibility();
    });

    const unlistenMemoList = listen("toggle-memo-list", () => {
      toggleMemoListVisibility();
    });

    // クリーンアップ関数
    return () => {
      unlistenFolderList.then((unlisten) => unlisten());
      unlistenMemoList.then((unlisten) => unlisten());
    };
  }, []);

  // グローバルショートカットの登録
  useEffect(() => {
    const setupShortcuts = async () => {
      try {
        // フォルダリストの表示/非表示を切り替えるショートカット
        await register("CommandOrControl+Shift+F", () => {
          toggleFolderListVisibility();
        });
        
        // メモリストの表示/非表示を切り替えるショートカット
        await register("CommandOrControl+Shift+M", () => {
          toggleMemoListVisibility();
        });
        
        console.log("ショートカットが登録されました");
      } catch (error) {
        console.error("ショートカットの登録に失敗しました:", error);
      }
    };
    
    setupShortcuts();
    
    // コンポーネントのアンマウント時にクリーンアップする必要はありません
    // Tauriアプリが終了するとショートカットは自動的に登録解除されます
  }, []);

  return (
    <AppSettingProvider>
      {(isCompleteInit) =>
        !isCompleteInit ? (
          <p>起動中</p>
        ) : (
          <QueryClientProvider client={queryClient}>
            <ChakraProvider value={defaultSystem}>
              <ColorModeProvider>
                <main className="container">
                  {/* メニューエリア */}
                  <HeaderContainer
                    ConfigMenuButton={ConfigMenuContainer}
                    toggleFolderListVisibility={toggleFolderListVisibility}
                    toggleMemoListVisibility={toggleMemoListVisibility}
                  />
                  {/* エディターエリア */}
                  <section className="editor-container">
                    {isFolderListVisible && <FolderList />}
                    {isMemoListVisible && <MemoListContainer />}
                    <EditArea />
                  </section>
                </main>
              </ColorModeProvider>
            </ChakraProvider>
          </QueryClientProvider>
        )
      }
    </AppSettingProvider>
  );
}

export default App;
