import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { EditArea as EditorPresentation } from "@/components/presentation/EditArea";
import { NotSelectedMemo } from "@/components/parts/NotSelectedMemo";

import {
  getDetailMemoQuery,
  updateMemoMutation,
  getMemoListQuery,
} from "@/utils/invoke/Memo";
import { getTagsQuery, createTagMutation } from "@/utils/invoke/Tags";

import { useFolderStore } from "@/utils/stores/folder";
import { useEditorStore } from "@/utils/stores/editor";
import { useAppSettingContext } from "@/components/context/AppSettingContext";

export const EditArea = () => {
  const editorDisplayMode = useEditorStore((state) => state.displayMode);
  const selectedMemoId = useEditorStore((state) => state.selectedMemoId);
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);

  const { data: memoData } = getDetailMemoQuery({ memoId: selectedMemoId });
  const { data: tagsData } = getTagsQuery();
  const { refetch: refetchGetMemoList } = getMemoListQuery({
    folderId: selectedFolderId,
  });

  const queryClient = useQueryClient();
  const { mutate: updateMemoMutate, mutateAsync: updateMemoMutateAsync } =
    updateMemoMutation(queryClient);
  const { mutateAsync: createTagMutateAsync } = createTagMutation(queryClient);

  const [tags, setTags] = useState<string[]>([]);
  const [mdText, setMdText] = useState<string | undefined>(undefined);

  const { theme } = useAppSettingContext();

  const handleSaveMdText = (mdText: string) => {
    if (!selectedMemoId) return;
    updateMemoMutate({
      memo: {
        id: selectedMemoId,
        content: mdText,
      },
    });
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

  const handleTitleChange = (newTitle: string) => {
    if (!selectedMemoId) return;
    updateMemoMutateAsync({
      memo: {
        id: selectedMemoId,
        title: newTitle,
      },
    }).then(() => {
      refetchGetMemoList();
    });
  };

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
        onTitleChange: handleTitleChange,
      }}
      editorDisplay={{
        mdText: mdText,
        theme: theme,
        saveMdText: handleSaveMdText,
        displayMode: editorDisplayMode,
      }}
    />
  );
};
