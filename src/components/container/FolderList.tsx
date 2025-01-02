import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { FolderList as FolderListPresentational } from "@/components/presentation/FolderList";

import { getFoldersQuery, createFolderMutation } from "@/utils/invoke/Folder";
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
  const { mutateAsync } = createFolderMutation(queryClient);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

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
      },
      ...folders,
    ];
  }, [foldersData, hasSearched, result]);

  const handleCreateFolder = () => {
    if (!newFolderName) return;
    mutateAsync({ name: newFolderName })
      .then(() => {
        setNewFolderName("");
      })
      .finally(() => {
        setIsPopoverOpen(false);
      });
  };

  const handleClickFolder = (folderId: number) => {
    setSelectedFolderId(folderId);
  };

  return (
    <FolderListPresentational
      folderList={folderList}
      selectedFolderId={selectedFolderId}
      onClickFolder={handleClickFolder}
      isPopoverOpen={isPopoverOpen}
      setIsPopoverOpen={setIsPopoverOpen}
      newFolderName={newFolderName}
      setNewFolderName={setNewFolderName}
      onClickCreateFolder={handleCreateFolder}
    />
  );
};
