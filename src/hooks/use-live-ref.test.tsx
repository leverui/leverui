import { createRenderEffect, createRoot, createSignal, flush } from 'solid-js';
import { expect, test } from 'vitest';
import { useLiveRef } from './use-live-ref';

/** Keep one object while its current value follows a Solid signal. */
function verifiesReactiveCurrent(): void {
  const state = createRoot(
    /** Own the signal and effect for the duration of the test. */
    (dispose) => {
      const [value, setValue] = createSignal('first');
      const ref = useLiveRef(value);
      const readings: string[] = [];
      createRenderEffect(
        /** Read the ref through a tracked Solid computation. */
        () => ref.current,
        /** Record each value the computation reads. */
        (current) => {
          readings.push(current);
        },
      );
      return { ref, setValue, readings, dispose };
    },
  );
  const original = state.ref;
  expect(state.ref.current).toBe('first');
  expect(state.readings).toEqual(['first']);
  state.setValue('second');
  flush();
  expect(state.ref).toBe(original);
  expect(state.ref.current).toBe('second');
  expect(state.readings).toEqual(['first', 'second']);
  state.dispose();
}

test('useLiveRef tracks current values with stable identity', verifiesReactiveCurrent);
