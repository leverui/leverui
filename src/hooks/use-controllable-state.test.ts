import { createSignal, flush } from 'solid-js';
import { expect, test, vi } from 'vitest';
import { useControllableState } from './use-controllable-state';

/** Verify local state accepts direct and functional updates exactly once. */
function verifiesLocalState(): void {
  const onChange = vi.fn();
  const initializer = vi.fn(
    /** Supply the initial local state lazily. */
    () => 2,
  );
  const [value, setValue] = useControllableState({ defaultValue: initializer, onChange });
  expect(initializer).toHaveBeenCalledTimes(1);
  expect(value()).toBe(2);
  setValue(
    /** Increase the currently visible state. */
    (current) => (current ?? 0) + 1,
  );
  flush();
  expect(value()).toBe(3);
  expect(onChange).toHaveBeenCalledWith(3);
  setValue(3);
  flush();
  expect(onChange).toHaveBeenCalledTimes(1);
}

test('useControllableState updates local state', verifiesLocalState);

/** Verify controlled updates notify without changing the caller's value. */
function verifiesControlledState(): void {
  const [external, setExternal] = createSignal<number | undefined>(4);
  const onChange = vi.fn();
  const [value, setValue] = useControllableState({
    /** Read the latest controlled value for each update. */
    get value() {
      return external();
    },
    onChange,
    /** Accept only changes that increase the current value. */
    shouldUpdate: (previous, next) => next > (previous ?? 0),
  });
  setValue(3);
  flush();
  expect(onChange).not.toHaveBeenCalled();
  setValue(5);
  flush();
  expect(onChange).toHaveBeenCalledWith(5);
  expect(value()).toBe(4);
  setExternal(6);
  flush();
  expect(value()).toBe(6);
  setValue(
    /** Resolve the functional update against the latest external value. */
    (current) => (current ?? 0) + 1,
  );
  flush();
  expect(onChange).toHaveBeenLastCalledWith(7);
}

test('useControllableState follows controlled updates and policy', verifiesControlledState);
