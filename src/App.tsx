import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FolderList } from "@/components/container/FolderList";
import { MemoList } from "@/components/presentation/MemoList";
import { EditArea } from "@/components/container/EditArea";

import { Header } from "@/components/presentation/Header";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="container">
        {/* メニューエリア */}
        <Header />
        {/* エディターエリア */}
        <section className="editor-container">
          <FolderList />
          <MemoList />
          <EditArea />
        </section>
      </main>
    </QueryClientProvider>
  );
}

export default App;
