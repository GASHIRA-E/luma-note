import type { FolderInvokes } from "../Folder";

type GetMemoList = Extract<FolderInvokes, { key: "getMemoList" }>;

export const getMemoList = (
  props: GetMemoList["props"]
): GetMemoList["return"] => {
  console.log("call mock invoke: getMemoList", props);
  return [
    {
      id: 1,
      title: "メモ1",
      content: "メモ1の内容",
      folderId: "1",
    },
    {
      id: 2,
      title: "メモ2",
      content: "メモ2の内容",
      folderId: "1",
    },
  ];
};
