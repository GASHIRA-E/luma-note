import { invoke } from "@tauri-apps/api/core";
// Folderドメインの定義
import { FolderKeys, FolderInvokes } from "./Folder";
import { IS_MOCK } from "@/config";

type InvokeKeys = FolderKeys;

export type InvokeBase<
  K extends string,
  Key extends K,
  T extends object | undefined,
  R
> = {
  key: Key;
  props: T;
  return: R;
};

type InvokeTypes = FolderInvokes;

export const customInvoke = async <K extends InvokeKeys>(
  key: K,
  props: Extract<InvokeTypes, { key: K }>["props"],
) => {
  if (IS_MOCK) {
    const mock = await import(`./_mock/${key}.ts`);
    return mock[key](props) as Extract<InvokeTypes, { key: K }>["return"];
  }
  return await invoke<Extract<InvokeTypes, { key: K }>["return"]>(key, props);
};
