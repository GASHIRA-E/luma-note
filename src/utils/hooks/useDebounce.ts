import { useCallback, useRef } from "react";

/**
 * デバウンス処理を行う
 */
export const useDebounce = <T extends any[]>(
  fn: (...args: T) => void,
  option: {
    delay: number;
    maxWait?: number;
  }
) => {
  const { delay, maxWait } = option;
  // 最後に関数が呼び出された時間
  const lastCallTime = useRef<number | null>(null);
  // 最後に関数が実行された時間
  const lastInvokeTime = useRef<number | null>(null);
  // デバウンス用のタイマー
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // maxWait用のタイマー
  const maxWaitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounced = useCallback(
    ((...args: T) => {
      const now = Date.now();
      if (lastCallTime.current === null) {
        lastCallTime.current = now;
      }

      if (lastInvokeTime.current === null) {
        lastInvokeTime.current = now;
      }

      const timeSinceLastInvoke = now - lastInvokeTime.current;

      // 既存のタイマーをクリア
      if (timer.current) {
        clearTimeout(timer.current);
      }

      // maxWait用のタイマーをクリア
      if (maxWait && maxWaitTimer.current) {
        clearTimeout(maxWaitTimer.current);
      }

      // maxWaitが設定されていて、最後の実行からmaxWaitが経過している場合は即時実行
      if (maxWait && timeSinceLastInvoke >= maxWait) {
        fn(...args);
        lastInvokeTime.current = now;
      } else {
        // delay後に関数を実行するタイマーをセット
        timer.current = setTimeout(() => {
          fn(...args);
          lastInvokeTime.current = Date.now();
        }, delay);

        // maxWaitが設定されている場合はmaxWait後に関数を実行するタイマーをセット
        if (maxWait) {
          maxWaitTimer.current = setTimeout(() => {
            fn(...args);
            lastInvokeTime.current = Date.now();
          }, maxWait - timeSinceLastInvoke);
        }
      }

      lastCallTime.current = now;
    }) as (...args: T) => void,
    [fn, delay, maxWait]
  );

  return debounced;
};
