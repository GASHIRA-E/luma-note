import { useMemo } from "react";

import { MemoList } from "@/components/presentation/MemoList";

import { getMemoListQuery } from "@/utils/invoke/Folder";
import { useFolderStore } from "@/utils/stores/folder";
import { useEditorStore } from "@/utils/stores/editor";
import { useSearchStore } from "@/utils/stores/search";

type MemoItem = React.ComponentProps<typeof MemoList>["memos"][number];

export const MemoListContainer = () => {
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const { data } = getMemoListQuery({ folder_id: selectedFolderId });

  const selectedMemoIdInStore = useEditorStore((state) => state.selectedMemoId);
  const setSelectedMemoId = useEditorStore((state) => state.setSelectedMemoId);

  const hasSearched = useSearchStore((state) => state.hasSearched);
  const result = useSearchStore((state) => state.result);

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

    return data.map<MemoItem>((memo) => ({
      id: memo.id,
      name: memo.title,
      updatedAt: memo.updated_at,
      resultIcon:
        (hasSearched && result?.some((r) => r.id === memo.id)) ?? false,
    }));
  }, [data, hasSearched, result]);

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
