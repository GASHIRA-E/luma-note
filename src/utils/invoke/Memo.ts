import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { InvokeBase, customInvoke } from "./_base";

export const MEMO_KEYS = {
  GET_DETAIL_MEMO: "get_detail_memo",
  CREATE_MEMO: "create_memo",
  DELETE_MEMO: "delete_memo",
  UPDATE_MEMO: "update_memo",
  GET_MEMO_LIST: "get_memo_list",
} as const;

// コマンド名の一覧
export type MemoKeys = (typeof MEMO_KEYS)[keyof typeof MEMO_KEYS];

// コマンドの型定義をまとめる
export type MemoInvokes =
  | GetMemo
  | CreateMemo
  | DeleteMemo
  | UpdateMemo
  | GetMemoList;

type GetMemo = InvokeBase<
  MemoKeys,
  typeof MEMO_KEYS.GET_DETAIL_MEMO,
  {
    memoId: number | null;
  },
  {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    tags: {
      id: number;
      name: string;
    }[];
  } | null
>;

export const getDetailMemoQuery = (props: GetMemo["props"]) => {
  return useQuery({
    queryKey: [MEMO_KEYS.GET_DETAIL_MEMO, props.memoId],
    queryFn: () => {
      if (props.memoId === null) {
        return Promise.resolve(null);
      }
      return customInvoke(MEMO_KEYS.GET_DETAIL_MEMO, props);
    },
  });
};

type CreateMemo = InvokeBase<
  MemoKeys,
  typeof MEMO_KEYS.CREATE_MEMO,
  {
    memo: {
      title: string;
      folder_id: number | null;
      content: string;
      tags?: number[] | null;
    };
  },
  null
>;

export const createMemoMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (props: CreateMemo["props"]) =>
      customInvoke(MEMO_KEYS.CREATE_MEMO, props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MEMO_KEYS.GET_MEMO_LIST],
      });
    },
  });
};

type UpdateMemo = InvokeBase<
  MemoKeys,
  typeof MEMO_KEYS.UPDATE_MEMO,
  {
    memo: {
      id: number;
      title?: string;
      folder_id?: number;
      content?: string;
      tags?: number[];
    };
  },
  null
>;

export const updateMemoMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (props: UpdateMemo["props"]) => {
      return customInvoke(MEMO_KEYS.UPDATE_MEMO, props);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [[MEMO_KEYS.GET_DETAIL_MEMO], [MEMO_KEYS.GET_MEMO_LIST]],
      });
    },
  });
};

type DeleteMemo = InvokeBase<
  MemoKeys,
  typeof MEMO_KEYS.DELETE_MEMO,
  {
    memoId: number;
  },
  null
>;

export const deleteMemoMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (props: DeleteMemo["props"]) =>
      customInvoke(MEMO_KEYS.DELETE_MEMO, props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MEMO_KEYS.GET_MEMO_LIST],
      });
    },
  });
};

type GetMemoList = InvokeBase<
  MemoKeys,
  typeof MEMO_KEYS.GET_MEMO_LIST,
  {
    folderId: number | null;
  },
  {
    id: number;
    title: string;
    updated_at: string;
  }[]
>;

export const getMemoListQuery = (props: GetMemoList["props"]) => {
  return useQuery({
    queryKey: [MEMO_KEYS.GET_MEMO_LIST, props.folderId],
    queryFn: () => customInvoke(MEMO_KEYS.GET_MEMO_LIST, props),
  });
};
