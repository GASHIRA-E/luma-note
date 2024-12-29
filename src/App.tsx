import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FolderList } from "@/components/container/FolderList";
import { MemoListContainer } from "@/components/container/MemoList";
import { EditArea } from "@/components/container/EditArea";
import { HeaderContainer } from "@/components/container/Header";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="container">
        {/* メニューエリア */}
        <HeaderContainer />
        {/* エディターエリア */}
        <section className="editor-container">
          <FolderList />
          <MemoListContainer />
          <EditArea />
        </section>
      </main>
    </QueryClientProvider>
  );
}

export default App;
