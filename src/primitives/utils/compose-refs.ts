import { type Ref, untrack } from 'solid-js';

type PossibleRef<T> = Ref<T>;

/** Whether ref fn. */
const isRefFn = <T>(ref: PossibleRef<T>): ref is (el: T | null) => void =>
  typeof ref === 'function';

/** Set the refs. */
const setRefs = <T>(refs: PossibleRef<T>[], node: T | null) => {
  for (const ref of refs) {
    if (Array.isArray(ref)) setRefs(ref, node);
    else if (isRefFn(ref)) ref(node);
  }
};

/**
 * Combine refs into one callback. Solid 2 applies a ref when it creates the
 * element, so the callback delivers the element to every ref directly; it
 * schedules no effect, which would tie the caller's render to machine state.
 */
export function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (el: T) => setRefs(refs, el);
}

/**
 * Combine refs that are read when the element is created. A JSX `ref={...}`
 * holding a call is evaluated where the element is created, which can be
 * inside a parent's tracked render; reading machine state there would rerun
 * that render, and remount its children, whenever the state changes. Getters
 * are read untracked, once, when the ref is applied.
 */
export function composeRefGetters<T>(...getters: Array<() => PossibleRef<T>>) {
  return (el: T) =>
    untrack(() =>
      setRefs(
        getters.map((getter) => getter()),
        el,
      ),
    );
}
