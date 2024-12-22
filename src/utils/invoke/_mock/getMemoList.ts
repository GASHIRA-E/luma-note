import type { GetMemoList } from "../Folder";

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
