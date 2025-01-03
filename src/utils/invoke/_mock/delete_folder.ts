import { FOLDER_KEYS, type FolderInvokes } from "../Folder";

type DeleteFolder = Extract<
  FolderInvokes,
  { key: typeof FOLDER_KEYS.DELETE_FOLDER }
>;

export const delete_folder = (
  props: DeleteFolder["props"]
): DeleteFolder["return"] => {
  console.log("call mock invoke: delete_folder", props);
  return null;
};
