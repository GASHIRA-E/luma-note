import { useState, useEffect } from "react";

import { FolderList as FolderListPresentational } from "@/components/global/FolderList";

import { customInvoke } from "@/utils/invoke";

export const FolderList = () => {
  type StateFolderList = React.ComponentProps<
    typeof FolderListPresentational
  >["folderList"];
  const [folderList, setFolderList] = useState<StateFolderList>([]);

  useEffect(() => {
    customInvoke(
      "getMemoList",
      { folderId: "1" },
      {
        isMock: true,
      }
    ).then((response) => {
      const _folderList = response.map<StateFolderList[number]>((memo) => ({
        folderId: memo.id,
        name: memo.title,
        selected: false,
      }));
      setFolderList([
        // 未分類フォルダー
        {
          folderId: -1,
          name: "未分類",
          selected: false,
        },
        ..._folderList,
      ]);
    });
  }, []);

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
