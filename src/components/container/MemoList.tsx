import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { MemoList } from "@/components/presentation/MemoList";

import {
  getMemoListQuery,
  createMemoMutation,
  updateMemoMutation,
  deleteMemoMutation,
} from "@/utils/invoke/Memo";
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

  // 新規メモ作成のポップオーバーの開閉状態と入力値
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // 名称変更モーダル関連のstate
  const [memoBeingRenamed, setMemoBeingRenamed] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // 削除確認モーダル関連のstate
  const [memoBeingDeleted, setMemoBeingDeleted] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const { mutateAsync: createMemoMutateAsync } =
    createMemoMutation(queryClient);
  const { mutateAsync: updateMemoMutateAsync } =
    updateMemoMutation(queryClient);
  const { mutateAsync: deleteMemoMutateAsync } =
    deleteMemoMutation(queryClient);

  const onClickNewMemo = () => {
    if (!inputValue) return;
    createMemoMutateAsync({ title: inputValue, content: "" })
      .then(() => {
        setInputValue("");
      })
      .finally(() => {
        setIsPopoverOpen(false);
      });
  };

  const handleClickMemo = (memoId: number) => {
    setSelectedMemoId(memoId);
  };

  const handleClickMenuMoveFolder = (memoId: number) => {
    alert(`フォルダ移動をクリック: ${memoId}`);
  };

  const handleClickMenuRenameMemo = (memoId: number) => {
    const memo = memos.find((m) => m.id === memoId);
    if (memo) {
      setMemoBeingRenamed({ id: memo.id, name: memo.name });
    }
  };

  const handleSaveRename = () => {
    if (memoBeingRenamed) {
      updateMemoMutateAsync({
        memoId: memoBeingRenamed.id,
        title: memoBeingRenamed.name,
      }).then(() => {
        setMemoBeingRenamed(null);
      });
    }
  };

  const handleClickMenuDeleteMemo = (memoId: number) => {
    const memo = memos.find((m) => m.id === memoId);
    if (memo) {
      setMemoBeingDeleted({ id: memo.id, name: memo.name });
    }
  };

  const handleConfirmDelete = () => {
    if (memoBeingDeleted) {
      deleteMemoMutateAsync({
        memoId: memoBeingDeleted.id,
        currentFolderId: selectedFolderId,
      }).then(() => {
        setMemoBeingDeleted(null);
      });
    }
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
      onClickMemo: handleClickMemo,
      onClickMoveFolder: handleClickMenuMoveFolder,
      onClickRenameMemo: handleClickMenuRenameMemo,
      onClickDeleteMemo: handleClickMenuDeleteMemo,
    }));
  }, [data, hasSearched, result, selectedMemoIdInStore]);

  return (
    <MemoList
      memos={memos}
      onClickNewMemo={onClickNewMemo}
      isPopoverOpen={isPopoverOpen}
      setIsPopoverOpen={setIsPopoverOpen}
      inputValue={inputValue}
      setInputValue={setInputValue}
      itemUpdateDialogProps={{
        isOpen: !!memoBeingRenamed,
        onClose: () => setMemoBeingRenamed(null),
        inputValue: memoBeingRenamed?.name || "",
        setInputValue: (name) =>
          setMemoBeingRenamed((prev) => (prev ? { ...prev, name } : prev)),
        onSave: handleSaveRename,
      }}
      deleteItemConfirmDialogProps={{
        targetItemName: memoBeingDeleted?.name || "",
        isOpen: !!memoBeingDeleted,
        onClose: () => setMemoBeingDeleted(null),
        onDelete: handleConfirmDelete,
      }}
    />
  );
};
