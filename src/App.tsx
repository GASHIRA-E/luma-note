import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { AppSettingProvider } from "@/components/context/AppSettingContext";

import { HeaderContainer } from "@/components/container/Header";
import { ConfigMenuContainer } from "@/components/container/ConfigMenu";
import { EditorContainer } from "@/components/container/EditorContainer";

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
                  <EditorContainer />
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
