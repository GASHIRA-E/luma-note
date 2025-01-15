import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { EditArea as EditorPresentation } from "@/components/presentation/EditArea";
import { NotSelectedMemo } from "@/components/parts/NotSelectedMemo";

import { getDetailMemoQuery, updateMemoMutation } from "@/utils/invoke/Memo";
import { getTagsQuery, createTagMutation } from "@/utils/invoke/Tags";
import { useEditorStore } from "@/utils/stores/editor";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { useAppSettingContext } from "@/components/context/AppSettingContext";

export const EditArea = () => {
  const editorDisplayMode = useEditorStore((state) => state.displayMode);
  const selectedMemoId = useEditorStore((state) => state.selectedMemoId);

  const { data: memoData } = getDetailMemoQuery({ memoId: selectedMemoId });
  const { data: tagsData } = getTagsQuery();

  const queryClient = useQueryClient();
  const { mutate: updateMemoMutate } = updateMemoMutation(queryClient);
  const { mutateAsync: createTagMutateAsync } = createTagMutation(queryClient);

  const [tags, setTags] = useState<string[]>([]);
  const [mdText, setMdText] = useState("");

  const { theme } = useAppSettingContext();

  const updateMdTextDebounce = useDebounce(
    (mdText: string) => {
      if (!selectedMemoId) return;
      setMdText(mdText);
      updateMemoMutate({
        memo: {
          id: selectedMemoId,
          content: mdText,
        },
      });
    },
    {
      delay: 500,
    }
  );

  const handleUpdateMdText = (mdText: string) => {
    setMdText(mdText);
    updateMdTextDebounce(mdText);
  };

  useEffect(() => {
    if (memoData) {
      setMdText(memoData.content);
      setTags(memoData.tags?.map((tag) => tag.name) || []);
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
      newTagId = res;
    } else {
      newTagId = tagId;
    }
    const currentTagIds = memoData?.tags?.map((tag) => tag.id) || [];
    setTags([...tags, tagName]);
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
      memoData?.tags?.flatMap((t) => (t.name !== tag ? t.id : [])) || [];
    setTags(tags.filter((t) => t !== tag));
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
    return <NotSelectedMemo />;
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
        theme: theme,
        updateMdText: handleUpdateMdText,
        displayMode: editorDisplayMode,
      }}
    />
  );
};
