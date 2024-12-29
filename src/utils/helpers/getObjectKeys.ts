// 参照: https://zenn.dev/ossamoon/articles/694a601ee62526

type GetObjectKeys = <T extends {[key: string]: unknown}>(obj: T) => (keyof T)[];

/**
 * 型がついた状態でオブジェクトのキーリストを取得する
 * @param obj オブジェクト
 * @returns キーリスト ユニオン型となる
 */
export const getObjectKeys: GetObjectKeys = (obj) => {
  return Object.keys(obj)
}
