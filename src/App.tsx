import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FolderList } from "@/components/container/FolderList";
import { MemoList } from "@/components/global/MemoList";
import { Editor } from "@/components/global/Editor";

import { Header } from "@/components/global/Header";

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
          <Editor />
        </section>
      </main>
    </QueryClientProvider>
  );
}

export default App;
