import { TAGS_KEYS, type TagsInvokes } from "../Tags";

type GetTags = Extract<TagsInvokes, { key: typeof TAGS_KEYS.GET_TAGS }>;

export const get_tags = (): GetTags["return"] => {
  console.log("call mock invoke: get_tags");
  return [
    { id: 1, name: "仕事" },
    { id: 2, name: "プライベート" },
    { id: 3, name: "買い物リスト" },
    { id: 4, name: "アイデア" },
    { id: 5, name: "旅行計画" },
    { id: 6, name: "読書メモ" },
    { id: 7, name: "レシピ" },
    { id: 8, name: "健康" },
    { id: 9, name: "フィットネス" },
    { id: 10, name: "プロジェクト" },
    { id: 11, name: "学習" },
    { id: 12, name: "会議メモ" },
    { id: 13, name: "日記" },
    { id: 14, name: "映画リスト" },
    { id: 15, name: "音楽" },
    { id: 16, name: "趣味" },
    { id: 17, name: "家計簿" },
    { id: 18, name: "TODOリスト" },
    { id: 19, name: "ウィッシュリスト" },
    { id: 20, name: "その他" },
  ];
};
