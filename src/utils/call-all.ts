import type { AnyFunction } from './types';

/** Compose optional callbacks so each receives the same arguments in order. */
export function callAll<T extends AnyFunction>(...fns: (T | undefined)[]) {
  /** Invoke each defined callback with the forwarded arguments. */
  return function mergedFn(...args: Parameters<T>) {
    fns.forEach(
      /** Skip absent callbacks without interrupting the sequence. */
      (fn) => fn?.(...args),
    );
  };
}
