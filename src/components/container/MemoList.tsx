import { useMemo } from "react";

import { MemoList } from "@/components/presentation/MemoList";

import { getMemoListQuery } from "@/utils/invoke/Memo";
import { useFolderStore } from "@/utils/stores/folder";
import { useEditorStore } from "@/utils/stores/editor";
import { useSearchStore } from "@/utils/stores/search";

type MemoItem = React.ComponentProps<typeof MemoList>["memos"][number];

export const MemoListContainer = () => {
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const { data } = getMemoListQuery({ folderId: selectedFolderId });

  const selectedMemoIdInStore = useEditorStore((state) => state.selectedMemoId);
  const setSelectedMemoId = useEditorStore((state) => state.setSelectedMemoId);

  const hasSearched = useSearchStore((state) => state.hasSearched);
  const result = useSearchStore((state) => state.result);

  const onClickNewMemo = () => {
    alert("新規メモ作成");
  };

  const onClickMemo = (memoId: number) => {
    setSelectedMemoId(memoId);
  };

  const onClickMoveFolder = (memoId: number) => {
    alert(`フォルダ移動をクリック: ${memoId}`);
  };

  const onClickRenameMemo = (memoId: number) => {
    alert(`名前変更をクリック: ${memoId}`);
  };

  const onClickDeleteMemo = (memoId: number) => {
    alert(`削除をクリック: ${memoId}`);
  };

  const memos = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.map<MemoItem>((memo) => ({
      id: memo.id,
      name: memo.title,
      updatedAt: memo.updatedAt,
      resultIcon:
        (hasSearched && result?.some((r) => r.id === memo.id)) ?? false,
      selected: memo.id === selectedMemoIdInStore,
      onClickMemo: onClickMemo,
      onClickMoveFolder: onClickMoveFolder,
      onClickRenameMemo: onClickRenameMemo,
      onClickDeleteMemo: onClickDeleteMemo,
    }));
  }, [data, hasSearched, result]);

  return <MemoList memos={memos} onClickNewMemo={onClickNewMemo} />;
};
