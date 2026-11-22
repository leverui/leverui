import { createMemo, type Accessor } from 'solid-js';

/** Read whether a reactive prop is supplied and choose its visible value. */
export function useControllableProp<T>(
  prop: Accessor<T | undefined>,
  state: Accessor<T>,
): readonly [Accessor<boolean>, Accessor<T>] {
  const controlled = createMemo(
    /** Treat only undefined as an absent controlled prop. */
    () => prop() !== undefined,
  );
  const value = createMemo(
    /** Preserve null and other valid controlled values. */
    () => {
      const current = prop();
      return current === undefined ? state() : current;
    },
  );
  return [controlled, value];
}
