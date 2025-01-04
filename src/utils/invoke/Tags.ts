import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { InvokeBase, customInvoke } from "./_base";
import type { TagInfo } from "@/types/invokeGenerate";

// コマンド名の定数
export const TAGS_KEYS = {
  GET_TAGS: "get_tags",
  CREATE_TAG: "create_tag",
  DELETE_TAG: "delete_tag",
} as const;

// コマンド名の一覧
export type TagsKeys = (typeof TAGS_KEYS)[keyof typeof TAGS_KEYS];

// コマンドの型定義をまとめる
export type TagsInvokes = GetTags | CreateTag | DeleteTag;

type GetTags = InvokeBase<
  TagsKeys,
  typeof TAGS_KEYS.GET_TAGS,
  undefined,
  TagInfo[]
>;

export const getTagsQuery = () => {
  return useQuery({
    queryKey: [TAGS_KEYS.GET_TAGS],
    queryFn: () => customInvoke(TAGS_KEYS.GET_TAGS, undefined),
  });
};

type CreateTag = InvokeBase<
  TagsKeys,
  typeof TAGS_KEYS.CREATE_TAG,
  {
    name: string;
  },
  number
>;

export const createTagMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (props: CreateTag["props"]) =>
      customInvoke(TAGS_KEYS.CREATE_TAG, props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS_KEYS.GET_TAGS] });
    },
  });
};

type DeleteTag = InvokeBase<
  TagsKeys,
  typeof TAGS_KEYS.DELETE_TAG,
  {
    tagId: number;
  },
  null
>;

export const deleteTagMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (props: DeleteTag["props"]) =>
      customInvoke(TAGS_KEYS.DELETE_TAG, props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS_KEYS.GET_TAGS] });
    },
  });
};
