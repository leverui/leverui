import { type Accessor, createMemo, createSignal, untrack } from 'solid-js';
import { runIfFn } from './run-if-fn';

export interface UseControllableStateProps<T> {
  value?: Accessor<T | undefined> | undefined;
  defaultValue?: Accessor<T | undefined> | T | undefined;
  onChange?: ((value: T) => void) | undefined;
}

/** Create the controllable state state and return its API. */
export function useControllableState<T>(props: UseControllableStateProps<T>) {
  const initialValue = runIfFn(props.defaultValue);
  const [uncontrolledValue, setUncontrolledValue] = createSignal<T | undefined>(() => initialValue);
  const controlled = createMemo(() => props.value?.() !== undefined);

  const currentValue = createMemo(() => (controlled() ? props.value?.() : uncontrolledValue()));

  /** Set the value. */
  const setValue = (next: Exclude<T, (...args: never[]) => unknown> | ((prev: T) => T)) => {
    untrack(() => {
      const nextValue = runIfFn(next, currentValue() as T);

      if (controlled()) {
        return props.onChange?.(nextValue);
      }

      setUncontrolledValue(() => nextValue);
      return props.onChange?.(nextValue);
    });
  };

  return [currentValue as Accessor<T>, setValue] as const;
}
