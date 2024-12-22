import { invoke } from "@tauri-apps/api/core";
// Folderドメインの定義
import { FolderKeys, CreateFolder, DeleteFolder } from "./Folder";

type InvokeKeys = FolderKeys;

export type InvokeBase<Key extends InvokeKeys, T extends object, R> = {
  key: Key;
  props: T;
  return: R;
};

type InvokeTypes = CreateFolder | DeleteFolder;

export const customInvoke = async <K extends InvokeKeys>(
  key: K,
  props: Extract<InvokeTypes, { key: K }>["props"]
): Promise<Extract<InvokeTypes, { key: K }>["return"]> => {
  return await invoke<Extract<InvokeTypes, { key: K }>["return"]>(key, props);
};
