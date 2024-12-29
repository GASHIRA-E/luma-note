import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { InvokeBase, customInvoke } from "./_base";

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
  {
    tags: {
      id: number;
      name: string;
    }[];
  }
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
  {
    id: number;
  }
>;

export const createTagMutation = (
  props: CreateTag["props"],
  queryClient: QueryClient
) => {
  return useMutation({
    mutationFn: () => customInvoke(TAGS_KEYS.CREATE_TAG, props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS_KEYS.GET_TAGS] });
    },
  });
};

type DeleteTag = InvokeBase<
  TagsKeys,
  typeof TAGS_KEYS.DELETE_TAG,
  {
    tag_id: number;
  },
  null
>;

export const deleteTagMutation = (props: DeleteTag["props"]) => {
  return useMutation({
    mutationFn: () => customInvoke(TAGS_KEYS.DELETE_TAG, props),
  });
};
