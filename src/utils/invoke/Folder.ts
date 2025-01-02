import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { InvokeBase, customInvoke } from "./_base";

export const FOLDER_KEYS = {
  GET_FOLDERS: "get_folders",
  CREATE_FOLDER: "create_folder",
  DELETE_FOLDER: "delete_folder",
  UPDATE_FOLDER: "update_folder",
  GET_MEMO_LIST: "get_memo_list",
} as const;

export type FolderKeys = (typeof FOLDER_KEYS)[keyof typeof FOLDER_KEYS];

export type FolderInvokes =
  | GetFolders
  | CreateFolder
  | DeleteFolder
  | UpdateFolder
  | GetMemoList;

export const getFoldersQuery = () => {
  return useQuery({
    queryKey: [FOLDER_KEYS.GET_FOLDERS],
    queryFn: () => customInvoke(FOLDER_KEYS.GET_FOLDERS, undefined),
  });
};

type GetFolders = InvokeBase<
  FolderKeys,
  typeof FOLDER_KEYS.GET_FOLDERS,
  undefined,
  {
    id: number;
    name: string;
  }[]
>;

export const createFolderMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (props: CreateFolder["props"]) =>
      customInvoke(FOLDER_KEYS.CREATE_FOLDER, props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLDER_KEYS.GET_FOLDERS] });
    },
  });
};

type CreateFolder = InvokeBase<
  FolderKeys,
  typeof FOLDER_KEYS.CREATE_FOLDER,
  {
    name: string;
  },
  null
>;

export const deleteFolderMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (props: DeleteFolder["props"]) =>
      customInvoke(FOLDER_KEYS.DELETE_FOLDER, props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLDER_KEYS.GET_FOLDERS] });
    },
  });
};

type DeleteFolder = InvokeBase<
  FolderKeys,
  typeof FOLDER_KEYS.DELETE_FOLDER,
  {
    folder_id: number;
    remove_relation_memo: boolean;
  },
  null
>;

export const updateFolderMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (props: UpdateFolder["props"]) =>
      customInvoke(FOLDER_KEYS.UPDATE_FOLDER, props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLDER_KEYS.GET_FOLDERS] });
    },
  });
};

type UpdateFolder = InvokeBase<
  FolderKeys,
  typeof FOLDER_KEYS.UPDATE_FOLDER,
  {
    folder_id: number;
    name?: string;
  },
  null
>;

export const getMemoListQuery = (props: GetMemoList["props"]) => {
  return useQuery({
    queryKey: [FOLDER_KEYS.GET_MEMO_LIST, props.folder_id],
    queryFn: () => customInvoke(FOLDER_KEYS.GET_MEMO_LIST, props),
  });
};

type GetMemoList = InvokeBase<
  FolderKeys,
  typeof FOLDER_KEYS.GET_MEMO_LIST,
  {
    folder_id: number | null;
  },
  {
    id: number;
    title: string;
    updated_at: string;
  }[]
>;
