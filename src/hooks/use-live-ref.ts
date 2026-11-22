import { type Accessor } from 'solid-js';

/** Stable ref-shaped view of the latest value from a Solid accessor. */
export interface LiveRef<T> {
  readonly current: T;
}

/** Read changing values through a stable object without copying a prop at setup. */
export function useLiveRef<T>(value: Accessor<T>): LiveRef<T> {
  return {
    /** Return the latest value and track it when read inside a Solid computation. */
    get current(): T {
      return value();
    },
  };
}
