import { createRoot, createSignal, flush } from 'solid-js';
import { expect, test } from 'vitest';
import { useControllableProp } from './use-controllable-prop';

/** Verify controlled detection preserves a supplied null value. */
function verifiesControllableProp(): void {
  const [supplied, setSupplied] = createSignal<string | null | undefined>(undefined);
  const [local] = createSignal<string | null>('local');
  const { controlled, value, dispose } = createRoot(
    /** Keep both derived accessors alive while the supplied prop changes. */
    (dispose) => {
      const [controlled, value] = useControllableProp(supplied, local);
      return { controlled, value, dispose };
    },
  );
  expect(controlled()).toBe(false);
  expect(value()).toBe('local');
  // Solid 2 rejects writes inside an owner's body, so the prop changes outside the root.
  setSupplied(null);
  flush();
  expect(controlled()).toBe(true);
  expect(value()).toBeNull();
  setSupplied('remote');
  flush();
  expect(value()).toBe('remote');
  dispose();
}

test('useControllableProp follows supplied values', verifiesControllableProp);
