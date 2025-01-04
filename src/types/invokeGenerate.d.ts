/*
 Generated by typeshare 1.13.2
*/

export type NullableId<T> =
  /** フィールドが存在しない場合 */
  | { type: "Null"; content?: undefined }
  /** フィールドが存在する場合(IDがNULLもしくは整数型) */
  | { type: "Value"; content?: T };

export interface CreateMemoIn {
  /** メモタイトル */
  title: string;
  /** メモフォルダID */
  folder_id: NullableId<number>;
  /** メモ内容 */
  content: string;
  /** メモタグ */
  tags?: number[];
}

export interface TagInfo {
  /** タグID */
  id: number;
  /** タグ名 */
  name: string;
}

export interface DetailMemoInfo {
  /** メモID */
  id: number;
  /** メモタイトル */
  title: string;
  /** メモフォルダID */
  folder_id: number;
  /** メモ内容 */
  content: string;
  /** メモ更新日時 */
  updated_at: string;
  /** メモタグ */
  tags?: TagInfo[];
}

export interface FolderInfo {
  /** フォルダID */
  id: number;
  /** フォルダ名 */
  name: string;
  /** フォルダ更新日時 */
  updated_at: string;
}

export interface MemoListInfo {
  /** メモID */
  id: number;
  /** メモタイトル */
  title: string;
  /** メモ更新日時 */
  updated_at: string;
  /** メモタグ */
  tags?: TagInfo[];
}

/** DBから受け取った情報をDetailMemoInfoにパースする前の型(バックエンドのみ利用) */
export interface RawDetailMemo {
  /** メモID */
  id: number;
  /** メモタイトル */
  title: string;
  /** メモ内容 */
  content: string;
  /** メモ更新日時 */
  updated_at: string;
  /** メモフォルダID */
  folder_id: number;
  /** メモタグ */
  tags?: string;
}

/** DBから受け取った情報をMemoListInfoにパースする前の型(バックエンドのみ利用) */
export interface RawMemoList {
  /** メモID */
  id: number;
  /** メモタイトル */
  title: string;
  /** メモ更新日時 */
  updated_at: string;
  /** メモタグ */
  tags?: string;
}

export interface UpdateMemoIn {
  /** メモID */
  id: number;
  /** メモタイトル */
  title?: string;
  /** メモフォルダID */
  folder_id: NullableId<number>;
  /** メモ内容 */
  content?: string;
  /** メモタグ */
  tags?: number[];
}
