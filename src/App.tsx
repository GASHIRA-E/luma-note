import "./App.css";

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
                  <HeaderContainer ConfigMenuButton={ConfigMenuContainer} />
                  {/* エディターエリア */}
                  <section className="editor-container">
                    <FolderList />
                    <MemoListContainer />
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
