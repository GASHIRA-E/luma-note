import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { InvokeBase, customInvoke } from "./_base";

export const MEMO_KEYS = {
  GET_MEMO: "get_memo",
  CREATE_MEMO: "create_memo",
  DELETE_MEMO: "delete_memo",
  UPDATE_MEMO: "update_memo",
} as const;

// コマンド名の一覧
export type MemoKeys = (typeof MEMO_KEYS)[keyof typeof MEMO_KEYS];

// コマンドの型定義をまとめる
export type MemoInvokes = GetMemo | CreateMemo | DeleteMemo | UpdateMemo;

type GetMemo = InvokeBase<
  MemoKeys,
  typeof MEMO_KEYS.GET_MEMO,
  {
    memo_id: number | null;
  },
  {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    tags: {
      id: number;
      name: string;
    }[];
  } | null
>;

export const getMemoQuery = (props: GetMemo["props"]) => {
  return useQuery({
    queryKey: [MEMO_KEYS.GET_MEMO, props.memo_id],
    queryFn: () => {
      if (props.memo_id === null) {
        return Promise.resolve(null);
      }
      return customInvoke(MEMO_KEYS.GET_MEMO, props);
    },
  });
};

type CreateMemo = InvokeBase<
  MemoKeys,
  typeof MEMO_KEYS.CREATE_MEMO,
  {
    title: string;
    content: string;
    tags?: number[];
  },
  {
    id: number;
  }
>;

export const createMemoMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (props: CreateMemo["props"]) =>
      customInvoke(MEMO_KEYS.CREATE_MEMO, props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEMO_KEYS.GET_MEMO] });
    },
  });
};

type UpdateMemo = InvokeBase<
  MemoKeys,
  typeof MEMO_KEYS.UPDATE_MEMO,
  {
    memo_id: number;
    title?: string;
    content?: string;
    tags?: number[];
  },
  null
>;

export const updateMemoMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (props: UpdateMemo["props"]) =>
      customInvoke(MEMO_KEYS.UPDATE_MEMO, props),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [MEMO_KEYS.GET_MEMO, variables.memo_id],
      });
    },
  });
};

type DeleteMemo = InvokeBase<
  MemoKeys,
  typeof MEMO_KEYS.DELETE_MEMO,
  {
    memo_id: number;
  },
  null
>;

export const deleteMemoMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (props: DeleteMemo["props"]) =>
      customInvoke(MEMO_KEYS.DELETE_MEMO, props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEMO_KEYS.GET_MEMO] });
    },
  });
};
