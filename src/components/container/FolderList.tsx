import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { FolderList as FolderListPresentational } from "@/components/presentation/FolderList";

import {
  getFoldersQuery,
  createFolderMutation,
  updateFolderMutation,
  deleteFolderMutation,
} from "@/utils/invoke/Folder";
import { useFolderStore } from "@/utils/stores/folder";
import { useSearchStore } from "@/utils/stores/search";
import { useEditorStore } from "@/utils/stores/editor";

type FolderListItem = React.ComponentProps<
  typeof FolderListPresentational
>["folderList"][number];

export const FolderList = () => {
  const queryClient = useQueryClient();

  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const setSelectedFolderId = useFolderStore(
    (state) => state.setSelectedFolderId
  );

  const { data: foldersData } = getFoldersQuery();
  const hasSearched = useSearchStore((state) => state.hasSearched);
  const result = useSearchStore((state) => state.result);
  const { mutateAsync: createFolderMutateAsync } =
    createFolderMutation(queryClient);
  const { mutateAsync: updateFolderMutateAsync } =
    updateFolderMutation(queryClient);
  const { mutateAsync: deleteFolderMutateAsync } =
    deleteFolderMutation(queryClient);

  const setSelectedMemoId = useEditorStore((state) => state.setSelectedMemoId);

  // フォルダー作成ポップオーバー関連のstate
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // 名称変更モーダル関連のstate
  const [folderBeingRenamed, setFolderBeingRenamed] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // 削除確認モーダル関連のstate
  const [folderBeingDeleted, setFolderBeingDeleted] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [removeRelationMemo, setRemoveRelationMemo] = useState(false);

  const handleClickFolder = (folderId: number | null) => {
    if (folderId === selectedFolderId) return;
    setSelectedFolderId(folderId);
    setSelectedMemoId(null);
  };

  const handleCreateFolder = () => {
    if (!newFolderName) return;
    createFolderMutateAsync({ name: newFolderName })
      .then((res) => {
        setNewFolderName("");
        setSelectedFolderId(res);
      })
      .finally(() => {
        setIsPopoverOpen(false);
      });
  };

  const handleDeleteFolder = (folderId: number | null) => {
    const folder = folderList.find((f) => f.folderId === folderId);
    if (folder && folder.folderId !== null) {
      setFolderBeingDeleted({ id: folder.folderId, name: folder.name });
    }
  };

  const handleConfirmDelete = () => {
    if (folderBeingDeleted) {
      deleteFolderMutateAsync({
        folderId: folderBeingDeleted.id,
        removeRelationMemo: removeRelationMemo,
      }).then(() => {
        setFolderBeingDeleted(null);
      });
    }
  };

  const handleRenameFolder = (folderId: number | null) => {
    if (folderId === null) return;
    const folder = folderList.find((f) => f.folderId === folderId);
    if (folder && folder.folderId !== null) {
      setFolderBeingRenamed({ id: folder.folderId, name: folder.name });
    }
  };

  const handleSaveRename = () => {
    if (folderBeingRenamed) {
      updateFolderMutateAsync({
        folderId: folderBeingRenamed.id,
        name: folderBeingRenamed.name,
      }).then(() => {
        setFolderBeingRenamed(null);
      });
    }
  };

  // フォルダーリストの作成
  const createFolderList = () => {
    const folders =
      foldersData?.map<FolderListItem>((folder) => {
        const memoCounts =
          hasSearched && result
            ? result.filter((r) => r.folderId === folder.id).length
            : undefined;
        return {
          folderId: folder.id,
          name: folder.name,
          memoCounts,
          selected: folder.id === selectedFolderId,
          onClick: handleClickFolder,
          onClickDelete: handleDeleteFolder,
          onClickRename: handleRenameFolder,
        };
      }) ?? [];

    const memoCounts =
      hasSearched && result
        ? result.filter((r) => r.folderId === null).length
        : undefined;
    return [
      {
        folderId: null,
        name: "未分類",
        memoCounts,
        selected: selectedFolderId === null,
        onClick: handleClickFolder,
        onClickDelete: () => {},
        onClickRename: () => {},
      },
      ...folders,
    ];
  };

  const handleClickQuickCreateFolder = () => {
    createFolderMutateAsync({ name: "Quick Folder" })
      .then((res) => {
        setNewFolderName("");
        setSelectedFolderId(res);
      })
      .finally(() => {
        setIsPopoverOpen(false);
      });
  };

  const folderList = useMemo(createFolderList, [
    foldersData,
    hasSearched,
    result,
    selectedFolderId,
  ]);

  return (
    <FolderListPresentational
      folderList={folderList}
      isPopoverOpen={isPopoverOpen}
      setIsPopoverOpen={setIsPopoverOpen}
      newFolderName={newFolderName}
      setNewFolderName={setNewFolderName}
      onClickCreateFolder={handleCreateFolder}
      itemUpdateDialogProps={{
        isOpen: !!folderBeingRenamed,
        onClose: () => setFolderBeingRenamed(null),
        inputValue: folderBeingRenamed?.name || "",
        setInputValue: (name) =>
          setFolderBeingRenamed((prev) => (prev ? { ...prev, name } : prev)),
        onSave: handleSaveRename,
      }}
      deleteItemConfirmDialogProps={{
        targetItemName: folderBeingDeleted?.name || "",
        removeRelationMemo: removeRelationMemo,
        setRemoveRelationMemo: setRemoveRelationMemo,
        isOpen: !!folderBeingDeleted,
        onClose: () => {
          setRemoveRelationMemo(false);
          setFolderBeingDeleted(null);
        },
        onDelete: handleConfirmDelete,
      }}
      onClickQuickCreateFolder={handleClickQuickCreateFolder}
    />
  );
};
