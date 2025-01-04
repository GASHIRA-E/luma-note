import { FOLDER_KEYS, type FolderInvokes } from "../Folder";

type GetFolders = Extract<
  FolderInvokes,
  { key: typeof FOLDER_KEYS.GET_FOLDERS }
>;

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
    {
      id: 3,
      name: "Mock Folder 3",
    },
    {
      id: 4,
      name: "Mock Folder 4",
    },
    {
      id: 5,
      name: "Mock Folder 5",
    },
  ];
};
