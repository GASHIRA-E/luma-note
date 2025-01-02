import { TAGS_KEYS, type TagsInvokes } from "../Tags";

type DeleteTag = Extract<TagsInvokes, { key: typeof TAGS_KEYS.DELETE_TAG }>;

export const delete_tag = (props: DeleteTag["props"]): DeleteTag["return"] => {
  console.log("call mock invoke: delete_tag", props);
  return null;
};
