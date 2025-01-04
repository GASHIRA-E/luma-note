import { InvokeBase, customInvoke } from "./_base";
import { type DetailMemoInfo } from "@/types/invokeGenerate";

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
  DetailMemoInfo[]
>;

export const findMemo = (props: FindMemoCommand["props"]) => {
  return customInvoke(SEARCH_KEYS.FIND_MEMO, props);
};
