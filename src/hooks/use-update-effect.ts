import { createEffect, createMemo, untrack, type Accessor } from 'solid-js';

/** Run after the first change to a tracked Solid value, with cleanup support. */
export function useUpdateEffect<T>(
  dependency: Accessor<T>,
  effect: (current: T, previous: T | undefined) => void | (() => void),
): void {
  const distinct = createMemo(dependency, { equals: Object.is });
  let previous = untrack(distinct);
  createEffect(
    distinct,
    /** Invoke the effect after the initial dependency value is established. */
    (current) => {
      const prior = previous;
      previous = current;
      return effect(current, prior) || undefined;
    },
    { defer: true },
  );
}
