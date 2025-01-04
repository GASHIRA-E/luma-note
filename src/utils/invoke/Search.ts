import { InvokeBase, customInvoke } from "./_base";

export const SEARCH_KEYS = {
  FIND_MEMO: "find_memo",
} as const;

// コマンド名の一覧
export type SearchKeys = (typeof SEARCH_KEYS)[keyof typeof SEARCH_KEYS];

// コマンドの型定義をまとめる
export type SearchInvokes = FindMemoCommand;

type FindMemoCommand = InvokeBase<
  SearchKeys,
  typeof SEARCH_KEYS.FIND_MEMO,
  {
    memoTitle: string;
    tags?: number[];
  },
  {
    files: DetailMemoInfo[];
  }
>;

export const findMemo = (props: FindMemoCommand["props"]) => {
  return customInvoke(SEARCH_KEYS.FIND_MEMO, props);
};

type DetailMemoInfo = {
  id: number;
  title: string;
  folder_id: number;
  updated_at: string;
};
