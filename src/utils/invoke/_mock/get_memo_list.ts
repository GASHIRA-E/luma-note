import type { FolderInvokes } from "../Folder";

type GetMemoList = Extract<FolderInvokes, { key: "get_memo_list" }>;

export const get_memo_list = (
  props: GetMemoList["props"]
): GetMemoList["return"] => {
  console.log("call mock invoke: get_memo_list", props);
  if (props.folder_id === null) {
    return [];
  }
  if (props.folder_id === 1) {
    return [
      {
        id: 1,
        title: "フォルダ1のメモ1",
        updated_at: "2021-01-01 00:00:00",
      },
      {
        id: 2,
        title: "フォルダ1のメモ2",
        updated_at: "2021-01-02 00:00:00",
      },
    ];
  }
  if (props.folder_id === 2) {
    return [
      {
        id: 3,
        title: "フォルダ2のメモ3",
        updated_at: "2021-01-03 00:00:00",
      },
    ];
  }
  return [];
};
