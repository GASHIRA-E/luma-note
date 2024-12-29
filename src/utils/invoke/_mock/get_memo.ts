import type { MemoInvokes } from "../Memo";

type GetMemo = Extract<MemoInvokes, { key: "get_memo" }>;

export const get_memo = (props: GetMemo["props"]): GetMemo["return"] => {
  console.log("call mock invoke: get_memo", props);
  if (props.memo_id === null) {
    return null;
  }
  if (props.memo_id === 1) {
    return {
      id: 1,
      title: "メモ1",
      content: `
# mockメモ1

これはサンプルのメモです。

## タグ

- test
- sample
- memo

## リンク

- [Google](https://www.google.com/)

## 画像

![sample](https://via.placeholder.com/150)

## コード

\`\`\`js
const sample = "Hello, World!";
console.log(sample);
\`\`\`
`,
      created_at: "2021-01-01 00:00:00",
      updated_at: "2021-01-01 00:00:00",
      tags: [
        {
          id: 1,
          name: "タグ1",
        },
      ],
    };
  }
  if (props.memo_id === 2) {
    return {
      id: 2,
      title: "メモ2",
      content: "hoge",
      created_at: "2021-01-01 00:00:00",
      updated_at: "2021-01-01 00:00:00",
      tags: [],
    };
  }
  return {
    id: 3,
    title: "メモother",
    content: "fuga",
    created_at: "2021-01-01 00:00:00",
    updated_at: "2021-01-01 00:00:00",
    tags: [],
  };
};
