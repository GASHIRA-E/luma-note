import { useQuery } from "@tanstack/react-query";
import { InvokeBase, customInvoke } from "./_base";

export const SEARCH_KEYS = {
  FIND_MEMO: "find_memo"
} as const;

// コマンド名の一覧
export type SearchKeys = (typeof SEARCH_KEYS)[keyof typeof SEARCH_KEYS];

// コマンドの型定義をまとめる
export type SearchInvokes = FindMemoCommand;

type FindMemoCommand = InvokeBase<
  SearchKeys,
  typeof SEARCH_KEYS.FIND_MEMO,
  {
    memo_title: string;
    tags?: number[];
  },
  {
    files: DetailMemoInfo[];
  }
>;

export const findMemoCommandQuery = (props: FindMemoCommand["props"]) => {
  return useQuery({
    queryKey: [SEARCH_KEYS.FIND_MEMO, props],
    queryFn: () => customInvoke(SEARCH_KEYS.FIND_MEMO, props),
  });
};

type DetailMemoInfo = {
  id: number;
  title: string;
  folder_id: number;
  updated_at: string;
};