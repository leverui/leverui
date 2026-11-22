import { createRoot, createSignal, flush } from 'solid-js';
import { expect, test } from 'vitest';
import { useUpdateEffect } from './use-update-effect';

/** Verify initial execution is skipped and cleanups follow later updates. */
function verifiesDeferredEffect(): void {
  const [count, setCount] = createSignal(0, { equals: false });
  const seen: string[] = [];
  const dispose = createRoot(
    /** Start the tracked effect within one Solid owner. */
    (stop) => {
      useUpdateEffect(
        count,
        /** Record only changes after the initial value. */
        (current, previous) => {
          seen.push(`${previous} → ${current}`);
          /** Release the previous effect before a later update. */
          function cleanup(): void {
            seen.push(`cleanup ${current}`);
          }
          return cleanup;
        },
      );
      return stop;
    },
  );

  expect(seen).toEqual([]);
  setCount(0);
  flush();
  expect(seen).toEqual([]);
  setCount(1);
  flush();
  expect(seen).toEqual(['0 → 1']);
  setCount(1);
  flush();
  expect(seen).toEqual(['0 → 1']);
  setCount(2);
  flush();
  expect(seen).toEqual(['0 → 1', 'cleanup 1', '1 → 2']);
  dispose();
  expect(seen).toEqual(['0 → 1', 'cleanup 1', '1 → 2', 'cleanup 2']);
}

test('useUpdateEffect runs only after changes and cleans up', verifiesDeferredEffect);
