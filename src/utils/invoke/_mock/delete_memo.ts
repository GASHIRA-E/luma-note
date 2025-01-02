import { MEMO_KEYS, type MemoInvokes } from "../Memo";

type DeleteMemo = Extract<MemoInvokes, { key: typeof MEMO_KEYS.DELETE_MEMO }>;

export const delete_memo = (
  props: DeleteMemo["props"]
): DeleteMemo["return"] => {
  console.log("call mock invoke: delete_memo", props);
  return null;
};
