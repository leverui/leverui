import { createRoot, createSignal, type Accessor, flush } from 'solid-js';
import { expect, test } from 'vitest';
import { usePrevious } from './use-previous';

/** Verify history changes only when SameValue detects a new value. */
function verifiesPreviousValue(): void {
  const [current, setCurrent] = createSignal(1);
  let previous: Accessor<number | undefined> | undefined;
  const dispose = createRoot(
    /** Keep the hook's memo alive across signal updates in this test. */
    (stop) => {
      previous = usePrevious(current);
      return stop;
    },
  );

  if (!previous) throw new Error('The previous-value accessor was not created.');
  expect(previous()).toBeUndefined();
  setCurrent(2);
  flush();
  expect(previous()).toBe(1);
  setCurrent(2);
  flush();
  expect(previous()).toBe(1);
  setCurrent(Number.NaN);
  flush();
  expect(previous()).toBe(2);
  setCurrent(Number.NaN);
  flush();
  expect(previous()).toBe(2);
  dispose();
}

test('usePrevious retains the prior distinct value', verifiesPreviousValue);
