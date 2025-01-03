import { MEMO_KEYS, type MemoInvokes } from "../Memo";

type CreateMemo = Extract<MemoInvokes, { key: typeof MEMO_KEYS.CREATE_MEMO }>;

export const create_memo = (
  props: CreateMemo["props"]
): CreateMemo["return"] => {
  console.log("call mock invoke: create_memo", props);
  return null;
};
