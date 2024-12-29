import { useMemo } from "react";

import { MemoList } from "@/components/presentation/MemoList";

import { getMemoListQuery } from "@/utils/invoke/Folder";
// import { useFolderStore } from "@/utils/stores/folder";
import { useEditorStore } from "@/utils/stores/editor";

export const MemoListContainer = () => {
  const selectedFolderId = 1;
  // const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const { data } = getMemoListQuery({ folder_id: selectedFolderId });

  const selectedMemoIdInStore = useEditorStore((state) => state.selectedMemoId);
  const setSelectedMemoId = useEditorStore((state) => state.setSelectedMemoId);

  const onClickMoveFolder = (memoId: number) => {
    alert(`フォルダ移動をクリック: ${memoId}`);
  };

  const onClickNewMemo = () => {
    alert("新規メモ作成");
  };

  const memos = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.map((memo) => ({
      id: memo.id,
      name: memo.title,
      updatedAt: memo.updated_at,
    }));
  }, [data]);

  const onClickMemo = (memoId: number) => {
    setSelectedMemoId(memoId);
  };

  return (
    <MemoList
      memos={memos}
      selectedMemoId={selectedMemoIdInStore}
      onClickMoveFolder={onClickMoveFolder}
      onClickNewMemo={onClickNewMemo}
      onClickMemo={onClickMemo}
    />
  );
};
