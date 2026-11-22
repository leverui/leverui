import { createMemo, type Accessor } from 'solid-js';

interface ValueHistory<T> {
  current: T;
  previous: T | undefined;
}

/** Track the value before the most recent distinct reactive value. */
export function usePrevious<T>(value: Accessor<T>): Accessor<T | undefined> {
  const history = createMemo<ValueHistory<T>>(
    /** Preserve the previous distinct value using SameValue comparison. */
    (prior) => {
      const current = value();
      if (!prior) return { current, previous: undefined };
      if (Object.is(current, prior.current)) return prior;
      return { current, previous: prior.current };
    },
  );

  /** Expose the previous value without allowing callers to mutate history. */
  function previous(): T | undefined {
    return history().previous;
  }

  return previous;
}
