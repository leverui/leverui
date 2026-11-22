import { type Accessor } from 'solid-js';

/** Create a stable callable that reads the latest callback accessor. */
export function useCallbackRef<Args extends unknown[], Result>(
  callback: Accessor<((...args: Args) => Result) | undefined>,
): (...args: Args) => Result | undefined {
  /** Invoke the current callback without rebuilding event handlers. */
  function callCurrent(...args: Args): Result | undefined {
    return callback()?.(...args);
  }

  return callCurrent;
}
