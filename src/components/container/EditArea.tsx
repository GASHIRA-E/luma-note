import { EditArea as EditorPresentation } from "@/components/presentation/EditArea";
import { useState, useMemo } from "react";

export const EditArea = () => {
  const [tags, setTags] = useState(["test", "sample", "memo"]);
  const [mdText, setMdText] = useState(`
# サンプルメモ1

これはサンプルのメモです。

## タグ

- test
- sample
- memo

## リンク

- [Google](https://www.google.com/)

## 画像

![sample](https://via.placeholder.com/150)

## コード

\`\`\`js
const sample = "Hello, World!";
console.log(sample);
\`\`\`
`);

  // サンプルのタグ一覧 (10件ほど)
  const allTags = [
    "test",
    "sample",
    "memo",
    "tag",
    "note",
    "idea",
    "study",
    "work",
    "private",
    "public",
  ];

  // タグを追加する(仮実装)
  const handleAddTag = (tag: string) => {
    setTags([...tags, tag]);
  };

  // タグを削除する(仮実装)
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // 設定済みのタグを除外
  const availableTags = useMemo<string[]>(
    () => allTags.filter((tag) => !tags.includes(tag)),
    [tags, allTags]
  );

  return (
    <EditorPresentation
      editorInfo={{
        memoTitle: "サンプルメモ1",
        tags: tags,
        availableTags: availableTags,
        addTag: handleAddTag,
        removeTag: handleRemoveTag,
      }}
      editorDisplay={{
        mdText: mdText,
        updateMdText: setMdText,
        // displayMode: "Edit",
      }}
    />
  );
};
