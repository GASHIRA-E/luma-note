import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { EditArea as EditorPresentation } from "@/components/presentation/EditArea";
import { getMemoQuery, updateMemoMutation } from "@/utils/invoke/Memo";
import { getTagsQuery, createTagMutation } from "@/utils/invoke/Tags";
import { useEditorStore } from "@/utils/stores/editor";

export const EditArea = () => {
  const editorDisplayMode = useEditorStore((state) => state.displayMode);
  const selectedMemoId = useEditorStore((state) => state.selectedMemoId);

  const { data: memoData } = getMemoQuery({ memoId: selectedMemoId });
  const { data: tagsData } = getTagsQuery();

  const queryClient = useQueryClient();
  const { mutate: updateMemoMutate } = updateMemoMutation(queryClient);
  const { mutateAsync: createTagMutateAsync } = createTagMutation(queryClient);

  const [tags, setTags] = useState<string[]>([]);
  const [mdText, setMdText] = useState("");

  useEffect(() => {
    if (memoData) {
      setMdText(memoData.content);
      setTags(memoData.tags.map((tag) => tag.name));
    } else {
      setMdText("");
      setTags([]);
    }
  }, [memoData]);

  // タグを追加する
  const handleAddTag = async (tagName: string) => {
    // メモが選択されていない場合は何もしない(エラー処理)
    if (!selectedMemoId) return;
    // タグ一覧から選択されたタグのIDを取得する
    const tagId = tagsData?.find((t) => t.name === tagName)?.id;
    let newTagId: number;
    if (tagId === undefined) {
      // タグが存在しない場合は新規作成
      const res = await createTagMutateAsync({ name: tagName });
      newTagId = res.id;
    } else {
      newTagId = tagId;
    }
    const currentTagIds = tagsData?.map((tag) => tag.id) || [];
    // タグを追加する
    updateMemoMutate({
      memo: {
        id: selectedMemoId,
        tags: [...currentTagIds, newTagId],
      },
    });
  };

  // タグを削除する
  const handleRemoveTag = (tag: string) => {
    // メモが選択されていない場合は何もしない(エラー処理)
    if (!selectedMemoId) return;
    // 除外後のタグIDリスト
    const removedTagIds =
      tagsData?.flatMap((t) => (t.name !== tag ? [t.id] : [])) || [];
    // タグを削除する
    updateMemoMutate({
      memo: {
        id: selectedMemoId,
        tags: removedTagIds,
      },
    });
  };

  // タグ候補一覧
  // 設定済みのタグを除外
  const availableTags = useMemo<string[]>(() => {
    if (!tagsData) {
      return [];
    }
    return tagsData.flatMap((tag) => {
      if (tags.includes(tag.name)) {
        return [];
      }
      return tag.name;
    });
  }, [tags, tagsData]);

  if (!memoData || selectedMemoId === null) {
    return <p>メモが選択されていません</p>;
  }

  return (
    <EditorPresentation
      editorInfo={{
        memoTitle: memoData.title,
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
