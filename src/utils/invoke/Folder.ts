import { InvokeBase } from "./index";

export type FolderKeys =
  | "createFolder"
  | "deleteFolder"
  | "updateFolder"
  | "getMemoList";

export type FolderInvokes =
  | CreateFolder
  | DeleteFolder
  | UpdateFolder
  | GetMemoList;

type CreateFolder = InvokeBase<
  FolderKeys,
  "createFolder",
  {
    name: string;
  },
  null
>;

type DeleteFolder = InvokeBase<
  FolderKeys,
  "deleteFolder",
  {
    folderId: string;
  },
  null
>;

type UpdateFolder = InvokeBase<
  FolderKeys,
  "updateFolder",
  {
    folderId: number;
    name?: string;
  },
  null
>;

type GetMemoList = InvokeBase<
  FolderKeys,
  "getMemoList",
  {
    folderId: string;
  },
  {
    id: number;
    title: string;
    content: string;
    folderId: string;
  }[]
>;
