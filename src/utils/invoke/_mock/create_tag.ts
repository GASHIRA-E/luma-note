import { TAGS_KEYS, type TagsInvokes } from "../Tags";

type CreateTag = Extract<TagsInvokes, { key: typeof TAGS_KEYS.CREATE_TAG }>;

export const create_tag = (props: CreateTag["props"]): CreateTag["return"] => {
  console.log("call mock invoke: create_tag", props);
  return 1;
};
