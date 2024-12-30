import { useState, useEffect } from "react";

import { FolderList as FolderListPresentational } from "@/components/presentation/FolderList";

import { getFoldersQuery } from "@/utils/invoke/Folder";
import { useFolderStore } from "@/utils/stores/folder";

export const FolderList = () => {
  type StateFolderList = React.ComponentProps<
    typeof FolderListPresentational
  >["folderList"];
  const [folderList, setFolderList] = useState<StateFolderList>([]);
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const setSelectedFolderId = useFolderStore(
    (state) => state.setSelectedFolderId
  );

  const { data } = getFoldersQuery();

  useEffect(() => {
    const folders =
      data?.map((folder) => {
        return {
          folderId: folder.id,
          name: folder.name,
        };
      }) ?? [];
    setFolderList([
      // 未分類フォルダー
      {
        folderId: -1,
        name: "未分類",
      },
      ...folders,
    ]);
  }, [data]);

  const handleClickNewFolder = () => {
    alert("新規フォルダー作成をクリック");
  };

  const handleClickFolder = (folderId: number) => {
    setSelectedFolderId(folderId);
  };

  return (
    <FolderListPresentational
      folderList={folderList}
      selectedFolderId={selectedFolderId}
      onClickNewFolder={handleClickNewFolder}
      onClickFolder={handleClickFolder}
    />
  );
};
