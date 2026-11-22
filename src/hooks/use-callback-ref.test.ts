import { createSignal, flush } from 'solid-js';
import { expect, test, vi } from 'vitest';
import { useCallbackRef } from './use-callback-ref';

/** Verify a stable wrapper uses the latest supplied callback. */
function verifiesCurrentCallback(): void {
  const first = vi.fn(
    /** Label values handled by the initial callback. */
    (value: number) => `first ${value}`,
  );
  const second = vi.fn(
    /** Label values handled by the replacement callback. */
    (value: number) => `second ${value}`,
  );
  const [callback, setCallback] = createSignal<((value: number) => string) | undefined>(
    () => first,
  );
  const stable = useCallbackRef(callback);

  expect(stable(1)).toBe('first 1');
  setCallback(
    /** Replace the callback without changing the stable wrapper. */
    () => second,
  );
  flush();
  expect(stable(2)).toBe('second 2');
  expect(first).toHaveBeenCalledTimes(1);
  expect(second).toHaveBeenCalledTimes(1);
  setCallback(undefined);
  flush();
  expect(stable(3)).toBeUndefined();
}

test('useCallbackRef invokes the latest callback', verifiesCurrentCallback);
