import ReactMonacoEditor from "@monaco-editor/react";

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
      options={{
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
      }}
    />
  );
};
