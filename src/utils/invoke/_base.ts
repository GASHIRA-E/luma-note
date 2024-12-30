import { invoke } from "@tauri-apps/api/core";
// Folderドメインの定義
import { FolderKeys, FolderInvokes } from "./Folder";
import { MemoKeys, MemoInvokes } from "./Memo";
import { TagsKeys, TagsInvokes } from "./Tags";
import { SearchKeys, SearchInvokes } from "./Search";

type InvokeKeys = FolderKeys | MemoKeys | TagsKeys | SearchKeys;

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

type InvokeTypes = FolderInvokes | MemoInvokes | TagsInvokes | SearchInvokes;

export const customInvoke = async <K extends InvokeKeys>(
  key: K,
  props: Extract<InvokeTypes, { key: K }>["props"]
) => {
  if (import.meta.env.MODE === "mock") {
    const mock = await import(`./_mock/${key}.ts`);
    return mock[key](props) as Extract<InvokeTypes, { key: K }>["return"];
  }
  return await invoke<Extract<InvokeTypes, { key: K }>["return"]>(key, props);
};
