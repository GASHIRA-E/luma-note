import { useState, useMemo, useEffect } from "react";

import { EditArea as EditorPresentation } from "@/components/presentation/EditArea";
import { getMemoQuery } from "@/utils/invoke/Memo";
import { getTagsQuery } from "@/utils/invoke/Tags";
import { useEditorStore } from "@/utils/stores/editor";

export const EditArea = () => {
  const editorDisplayMode = useEditorStore((state) => state.displayMode);
  const selectedMemoId = useEditorStore((state) => state.selectedMemoId);

  const { data } = getMemoQuery({ memo_id: selectedMemoId });

  const [tags, setTags] = useState<string[]>([]);
  const [mdText, setMdText] = useState("");

  useEffect(() => {
    if (data) {
      setMdText(data.content);
      setTags(data.tags.map((tag) => tag.name));
    } else {
      setMdText("");
      setTags([]);
    }
  }, [data]);

  const { data: tagsData } = getTagsQuery();

  // タグを追加する(仮実装)
  const handleAddTag = (tag: string) => {
    setTags([...tags, tag]);
  };

  // タグを削除する(仮実装)
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // タグ候補一覧
  // 設定済みのタグを除外
  const availableTags = useMemo<string[]>(() => {
    if (!tagsData) {
      return [];
    }
    return tagsData.tags
      .flatMap((tag) => tag.name)
      .filter((tag) => !tags.includes(tag));
  }, [tags, tagsData]);

  if (!data) {
    return <p>メモが選択されていません</p>;
  }

  return (
    <EditorPresentation
      editorInfo={{
        memoTitle: data.title,
        tags: tags,
        availableTags: availableTags,
        addTag: handleAddTag,
        removeTag: handleRemoveTag,
      }}
      editorDisplay={{
        mdText: mdText,
        updateMdText: setMdText,
        displayMode: editorDisplayMode,
      }}
    />
  );
};
