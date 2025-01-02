import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { FolderList as FolderListPresentational } from "@/components/presentation/FolderList";

import {
  getFoldersQuery,
  createFolderMutation,
  updateFolderMutation,
} from "@/utils/invoke/Folder";
import { useFolderStore } from "@/utils/stores/folder";
import { useSearchStore } from "@/utils/stores/search";

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

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderBeingRenamed, setFolderBeingRenamed] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleClickFolder = (folderId: number) => {
    setSelectedFolderId(folderId);
  };

  const handleDeleteFolder = (folderId: number) => {
    // Implement the logic to delete the folder
    alert(`Delete folder ${folderId}`);
  };

  const handleRenameFolder = (folderId: number) => {
    // Hack: フォーカスが移動してからダイアログを開き、Menuからフォーカスを外すため
    setTimeout(() => {
      const folder = folderList.find((f) => f.folderId === folderId);
      if (folder) {
        setFolderBeingRenamed({ id: folder.folderId, name: folder.name });
      }
    }, 10);
  };

  // 名称変更の保存処理
  const handleSaveRename = () => {
    if (folderBeingRenamed) {
      updateFolderMutateAsync({
        folder_id: folderBeingRenamed.id,
        name: folderBeingRenamed.name,
      }).then(() => {
        setFolderBeingRenamed(null);
      });
    }
  };

  const folderList = useMemo(() => {
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
      // 未分類フォルダー
      {
        folderId: -1,
        name: "未分類",
        memoCounts,
        selected: selectedFolderId === -1,
        onClick: handleClickFolder,
        onClickDelete: handleDeleteFolder,
        onClickRename: handleRenameFolder,
      },
      ...folders,
    ];
  }, [foldersData, hasSearched, result, selectedFolderId]);

  const handleCreateFolder = () => {
    if (!newFolderName) return;
    createFolderMutateAsync({ name: newFolderName })
      .then(() => {
        setNewFolderName("");
      })
      .finally(() => {
        setIsPopoverOpen(false);
      });
  };

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
    />
  );
};
