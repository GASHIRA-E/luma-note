import { useState, useEffect } from "react";

import { FolderList as FolderListPresentational } from "@/components/global/FolderList";

import { getFoldersQuery } from "@/utils/invoke/Folder";

export const FolderList = () => {
  type StateFolderList = React.ComponentProps<
    typeof FolderListPresentational
  >["folderList"];
  const [folderList, setFolderList] = useState<StateFolderList>([]);

  const { data } = getFoldersQuery();

  useEffect(() => {
    console.log(data);
    const folders =
      data?.map((folder) => {
        return {
          folderId: folder.id,
          name: folder.name,
          selected: false,
        };
      }) ?? [];
    setFolderList([
      // 未分類フォルダー
      {
        folderId: -1,
        name: "未分類",
        selected: false,
      },
      ...folders,
    ]);
  }, [data]);

  const handleClickNewFolder = () => {
    console.log("onClickNewFolder");
  };

  const handleClickFolder = (folderId: string) => {
    console.log("onClickFolder", folderId);
  };

  return (
    <FolderListPresentational
      folderList={folderList}
      onClickNewFolder={handleClickNewFolder}
      onClickFolder={handleClickFolder}
    />
  );
};
