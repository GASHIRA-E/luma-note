import { FOLDER_KEYS, type FolderInvokes } from "../Folder";

type CreateFolder = Extract<
  FolderInvokes,
  { key: typeof FOLDER_KEYS.CREATE_FOLDER }
>;

export const create_folder = (
  props: CreateFolder["props"]
): CreateFolder["return"] => {
  console.log("call mock invoke: create_folder", props);
  return 1;
};
