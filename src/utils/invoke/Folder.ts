import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { InvokeBase, customInvoke } from "./_base";

export type FolderKeys =
  | "get_folders"
  | "create_folder"
  | "delete_folder"
  | "update_folder"
  | "get_memo_list";

export type FolderInvokes =
  | GetFolders
  | CreateFolder
  | DeleteFolder
  | UpdateFolder
  | GetMemoList;

export const getFoldersQuery = () => {
  console.log("getFoldersQuery");
  return useQuery({
    queryKey: ["get_folders"],
    queryFn: () => customInvoke("get_folders", undefined),
  });
};

type GetFolders = InvokeBase<
  FolderKeys,
  "get_folders",
  undefined,
  {
    id: number;
    name: string;
  }[]
>;

export const createFolderQuery = (props: CreateFolder["props"]) => {
  return useQuery({
    queryKey: ["createFolder"],
    queryFn: () => customInvoke("create_folder", props),
  });
};

type CreateFolder = InvokeBase<
  FolderKeys,
  "create_folder",
  {
    name: string;
  },
  null
>;

export const deleteFolderQuery = (
  props: DeleteFolder["props"],
  queryClient: QueryClient
) => {
  return useMutation({
    mutationFn: () => customInvoke("delete_folder", props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMemoList"] });
    },
  });
};

type DeleteFolder = InvokeBase<
  FolderKeys,
  "delete_folder",
  {
    folderId: string;
  },
  null
>;

export const updateFolderQuery = (
  props: UpdateFolder["props"],
  queryClient: QueryClient
) => {
  return useMutation({
    mutationFn: () => customInvoke("update_folder", props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_memo_list"] });
    },
  });
};

type UpdateFolder = InvokeBase<
  FolderKeys,
  "update_folder",
  {
    folderId: number;
    name?: string;
  },
  null
>;

export const getMemoListQuery = (props: GetMemoList["props"]) => {
  return useQuery({
    queryKey: ["get_memo_list", props.folderId],
    queryFn: () => customInvoke("get_memo_list", props),
  });
};

type GetMemoList = InvokeBase<
  FolderKeys,
  "get_memo_list",
  {
    folderId: string;
  },
  {
    id: number;
    title: string;
    updated_at: string;
  }[]
>;
