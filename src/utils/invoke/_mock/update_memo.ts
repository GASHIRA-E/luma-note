import { MEMO_KEYS, type MemoInvokes } from "../Memo";

type UpdateMemo = Extract<MemoInvokes, { key: typeof MEMO_KEYS.UPDATE_MEMO }>;

export const update_memo = (
  props: UpdateMemo["props"]
): UpdateMemo["return"] => {
  console.log("call mock invoke: update_memo", props);
  return null;
};
