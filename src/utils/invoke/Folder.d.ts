import { InvokeBase } from "./index";

export type FolderKeys =
  | "createFolder"
  | "deleteFolder"
  | "updateFolder"
  | "getMemoList";

export type CreateFolder = InvokeBase<
  "createFolder",
  {
    name: string;
  },
  null
>;

export type DeleteFolder = InvokeBase<
  "deleteFolder",
  {
    folderId: string;
  },
  null
>;

export type UpdateFolder = InvokeBase<
  "updateFolder",
  {
    folderId: number;
    name?: string;
  },
  null
>;

export type GetMemoList = InvokeBase<
  "getMemoList",
  {
    folderId: string;
  },
  {
    id: string;
    title: string;
    content: string;
    folderId: string;
  }[]
>;
