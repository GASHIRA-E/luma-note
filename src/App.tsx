import "./App.css";

import { FolderList } from "@/components/container/FolderList";
import { MemoList } from "@/components/global/MemoList";
import { Editor } from "@/components/global/Editor";

import { Header } from "@/components/global/Header";

function App() {
  return (
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
  );
}

export default App;
