import { useEffect, useRef } from "react";

export const useScrollSync = <
  Ref1 extends HTMLElement = HTMLElement,
  Ref2 extends HTMLElement = HTMLElement
>() => {
  // 同期する2つの要素のrefを作成
  const ref1 = useRef<Ref1>(null);
  const ref2 = useRef<Ref2>(null);

  // スクロールの同期を処理する関数
  const handleScroll = (source: HTMLElement, target: HTMLElement) => {
    const scrollTopRatio =
      source.scrollTop / (source.scrollHeight - source.clientHeight);

    const targetScrollTopRatio =
      scrollTopRatio * (target.scrollHeight - target.clientHeight);

    target.scrollTop = targetScrollTopRatio;
  };

  // 各refのスクロールイベントのハンドラー
  const handleScroll1 = () => {
    handleScroll(ref1.current!, ref2.current!);
  };

  useEffect(() => {
    if (!ref1.current || !ref2.current) return;

    // 両方のrefにイベントリスナーを追加
    ref1.current.addEventListener("scroll", handleScroll1);

    // コンポーネントのアンマウント時にイベントリスナーをクリーンアップ
    return () => {
      ref1.current?.removeEventListener("scroll", handleScroll1);
    };
  }, [ref1, ref2]);

  // コンポーネントで使用するためにrefを返す
  return { ref1, ref2 };
};
