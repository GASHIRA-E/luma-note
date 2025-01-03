import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { MemoList } from "@/components/presentation/MemoList";

import { getFoldersQuery } from "@/utils/invoke/Folder";
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

  const { data: foldersData } = getFoldersQuery();

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

  // フォルダー変更モーダル関連のstate
  const [memoBeingMoved, setMemoBeingMoved] = useState<{
    id: number;
    folderId: number | null;
  } | null>(null);
  const [moveFolderId, setMoveFolderId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { mutateAsync: createMemoMutateAsync } =
    createMemoMutation(queryClient);
  const { mutateAsync: updateMemoMutateAsync } =
    updateMemoMutation(queryClient);
  const { mutateAsync: deleteMemoMutateAsync } =
    deleteMemoMutation(queryClient);

  const onClickNewMemo = () => {
    if (!inputValue) return;
    createMemoMutateAsync({
      memo: {
        title: inputValue,
        folder_id: selectedFolderId,
        content: "",
      },
    })
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
    const memo = memos.find((m) => m.id === memoId);
    if (memo) {
      setMemoBeingMoved({ id: memo.id, folderId: selectedFolderId });
    }
  };

  const handleClickSaveMoveFolder = () => {
    if (memoBeingMoved) {
      updateMemoMutateAsync({
        memo: {
          id: memoBeingMoved.id,
          title: "Rustで作るWASM - 読書メモ",
          // TODO: invokeの型がnull対応できていないのでfolder_idがnullの場合は後で実装
          folder_id: moveFolderId || undefined,
          content: "",
        },
      }).then(() => {
        setMemoBeingMoved(null);
      });
    }
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
        memo: {
          id: memoBeingRenamed.id,
          title: memoBeingRenamed.name,
        },
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
      }).then(() => {
        if (selectedMemoIdInStore === memoBeingDeleted.id) {
          setSelectedMemoId(null);
        }
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
      updatedAt: memo.updated_at,
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
      memoChangeFolderDialogProps={{
        currentFolderId: memoBeingMoved?.folderId || null,
        folders: foldersData
          ? [{ id: null, name: "未分類" }, ...foldersData]
          : [{ id: null, name: "未分類" }],
        folderId: moveFolderId,
        setFolderId: setMoveFolderId,
        isOpen: !!memoBeingMoved,
        onClose: () => {
          setMemoBeingMoved(null);
          setMoveFolderId(null);
        },
        onClickSave: handleClickSaveMoveFolder,
      }}
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
