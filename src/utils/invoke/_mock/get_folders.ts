import  { FOLDER_KEYS, type FolderInvokes } from "../Folder";

type GetFolders = Extract<FolderInvokes, { key: typeof FOLDER_KEYS.GET_FOLDERS }>;

export const get_folders = (): GetFolders["return"] => {
  console.log("call mock invoke: get_folders");
  return [
    {
      id: 1,
      name: "Mock Folder 1",
    },
    {
      id: 2,
      name: "Mock Folder 2",
    },
  ];
};
