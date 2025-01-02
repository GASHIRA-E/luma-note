import { useState } from "react";

/**
 * 日本語のIME入力状態を制御するカスタムフック
 */
export const useInputCompositionControl = () => {
  const [isComposing, setIsComposing] = useState(false);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  /**
   * Enterキーが押されたとき、かつIME入力中の場合はイベントをキャンセルする
   * @param callback Enterキーが押されたときに実行するコールバック関数
   * @returns イベントハンドラ
   */
  const wrapExcludeComposingEnter =
    (callback: (event: React.KeyboardEvent<HTMLInputElement>) => void) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && isComposing) {
        e.preventDefault();
      } else {
        callback(e);
      }
    };

  return {
    isComposing,
    overrideEvents: {
      onCompositionStart: handleCompositionStart,
      onCompositionEnd: handleCompositionEnd,
    },
    wrapExcludeComposingEnter,
  };
};
