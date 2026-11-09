import { useEffect, useRef } from 'react';

type PendingCall<T extends unknown[]> = {
  timer: ReturnType<typeof setTimeout>;
  args: T;
};

export function useDebouncedCallback<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
) {
  const callbackRef = useRef(callback);
  const pendingRef = useRef<PendingCall<T> | null>(null);

  const run = (...args: T) => {
    cancel();

    const timer = setTimeout(() => {
      const pending = pendingRef.current;
      if (pending === null) return;

      pendingRef.current = null;
      callbackRef.current(...pending.args);
    }, delay);

    pendingRef.current = { timer, args };
  };

  const flush = () => {
    const pending = pendingRef.current;
    if (pending === null) return;

    clearTimeout(pending.timer);
    pendingRef.current = null;

    callbackRef.current(...pending.args);
  };

  const cancel = () => {
    const pending = pendingRef.current;
    if (pending === null) return;

    clearTimeout(pending.timer);
    pendingRef.current = null;
  };

  // Update callback if it is updated after first render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clear on unmount
  useEffect(() => {
    return () => {
      const pending = pendingRef.current;

      if (pending !== null) {
        clearTimeout(pending.timer);
        pendingRef.current = null;
      }
    };
  }, []);

  return { run, cancel, flush };
}
