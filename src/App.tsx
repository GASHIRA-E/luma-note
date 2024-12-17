import "./App.css";

import { FileList } from "@/components/global/FileList";
import { FolderList } from "@/components/global/FolderList";
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
        <FileList />
        <Editor />
      </section>
    </main>
  );
}

export default App;
