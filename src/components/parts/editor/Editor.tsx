import ReactMonacoEditor from "@monaco-editor/react";
import { MonacoMarkdownExtension } from "monaco-markdown";

type EditorProps = {
  value: string;
  selectedMemoId: number | undefined;
  onChange: (value: string) => void;
};

export const Editor = (props: EditorProps) => {
  return (
    <ReactMonacoEditor
      key={`${props.selectedMemoId}_editor`}
      width="100%"
      defaultLanguage="markdown"
      defaultValue={props.value}
      onChange={(value) => {
        if (value !== undefined) {
          props.onChange(value);
        }
      }}
      onMount={(editor) => {
        const mmd = new MonacoMarkdownExtension();
        // @ts-ignore monaco-markdownの使用しているmonaco-editorのバージョンが古く型定義があってないと思われる
        mmd.activate(editor);
      }}
      options={{
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
      }}
    />
  );
};
