import { SEARCH_KEYS, type SearchInvokes } from "../Search";

type FindMemo = Extract<SearchInvokes, { key: typeof SEARCH_KEYS.FIND_MEMO }>;

export const find_memo = (props: FindMemo["props"]): FindMemo["return"] => {
  console.log("call mock invoke: find_memo", props);

  const allMemos = [
    {
      id: 1,
      title: "フォルダ1のメモ1",
      folder_id: 1,
      updated_at: "2021-01-01 00:00:00",
    },
  ];

  return { files: allMemos };
};
