import type { FolderInvokes } from "../Folder";

type GetMemoList = Extract<FolderInvokes, { key: "get_memo_list" }>;

export const getMemoList = (
  props: GetMemoList["props"]
): GetMemoList["return"] => {
  console.log("call mock invoke: getMemoList", props);
  return [
    {
      id: 1,
      title: "メモ1",
      updated_at: "2021-01-01 00:00:00",
    },
    {
      id: 2,
      title: "メモ2",
      updated_at: "2021-01-02 00:00:00",
    },
  ];
};
