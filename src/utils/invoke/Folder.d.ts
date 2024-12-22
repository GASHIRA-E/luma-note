import { InvokeBase } from "./index";

export type FolderKeys =
  | "createFolder"
  | "deleteFolder"
  | "updateFolder"
  | "getMemoList";

export type FolderInvokes = CreateFolder | DeleteFolder | UpdateFolder | GetMemoList;

type CreateFolder = InvokeBase<
  FolderKeys,
  "createFolder",
  {
    name: string;
  },
  {}
>;

type DeleteFolder = InvokeBase<
  FolderKeys,
  "deleteFolder",
  {
    folderId: string;
  },
  {}
>;

type UpdateFolder = InvokeBase<
  FolderKeys,
  "updateFolder",
  {
    folderId: number;
    name?: string;
  },
  {}
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
