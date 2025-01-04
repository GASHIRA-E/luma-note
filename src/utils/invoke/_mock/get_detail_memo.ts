import { MEMO_KEYS, type MemoInvokes } from "../Memo";

type GetMemo = Extract<MemoInvokes, { key: typeof MEMO_KEYS.GET_DETAIL_MEMO }>;

export const get_detail_memo = (props: GetMemo["props"]): GetMemo["return"] => {
  console.log("call mock invoke: get_detail_memo", props);
  if (props.memoId === null) {
    return null;
  }
  if (props.memoId === 1) {
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
      createdAt: "2021-01-01 00:00:00",
      updatedAt: "2021-01-01 00:00:00",
      tags: [
        {
          id: 1,
          name: "仕事",
        },
        {
          id: 2,
          name: "プライベート",
        },
      ],
    };
  }
  if (props.memoId === 2) {
    return {
      id: 2,
      title: "メモ2",
      content: "hoge",
      createdAt: "2021-01-01 00:00:00",
      updatedAt: "2021-01-01 00:00:00",
      tags: [],
    };
  }
  return {
    id: 3,
    title: "メモother",
    content: "fuga",
    createdAt: "2021-01-01 00:00:00",
    updatedAt: "2021-01-01 00:00:00",
    tags: [
      {
        id: 3,
        name: "買い物リスト",
      },
    ],
  };
};
