import { FOLDER_KEYS, type FolderInvokes } from "../Folder";

type UpdateFolder = Extract<
  FolderInvokes,
  { key: typeof FOLDER_KEYS.UPDATE_FOLDER }
>;

export const update_folder = (
  props: UpdateFolder["props"]
): UpdateFolder["return"] => {
  console.log("call mock invoke: update_folder", props);
  return null;
};
