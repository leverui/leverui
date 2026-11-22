import { createSignal, type Accessor } from 'solid-js';

/** Controlled value, initial state, and update policy. */
export interface UseControllableStateProps<T> {
  value?: T | undefined;
  defaultValue?: T | (() => T) | undefined;
  onChange?: ((value: T) => void) | undefined;
  shouldUpdate?: ((previous: T | undefined, next: T) => boolean) | undefined;
}

/** A direct value or updater based on the current visible value. */
export type ControllableStateUpdate<T> = T | ((previous: T | undefined) => T);

/** Resolve a direct value or lazy initializer once for uncontrolled state. */
function initialValue<T>(value: T | (() => T) | undefined): T | undefined {
  // A function-valued state is treated as an initializer.
  return typeof value === 'function' ? (value as () => T)() : value;
}

/** Use strict inequality when no update policy is supplied. */
function shouldUpdateDefault<T>(previous: T | undefined, next: T): boolean {
  return previous !== next;
}

/** Coordinate controlled and local state through a Solid accessor and setter. */
export function useControllableState<T>(
  props: UseControllableStateProps<T>,
): readonly [Accessor<T | undefined>, (next: ControllableStateUpdate<T>) => void] {
  const initial = initialValue(props.defaultValue);
  // The function form keeps a function-valued state from being read as an initializer.
  const [localValue, setLocalValue] = createSignal<T | undefined>(() => initial);

  /** Prefer the current supplied value when the caller controls this state. */
  function value(): T | undefined {
    const current = props.value;
    return current === undefined ? localValue() : current;
  }

  /** Update local state when uncontrolled and notify on accepted changes. */
  function setValue(next: ControllableStateUpdate<T>): void {
    const previous = value();
    // A function argument is an updater even when T can be callable.
    const resolved =
      typeof next === 'function' ? (next as (current: T | undefined) => T)(previous) : next;
    if (!(props.shouldUpdate ?? shouldUpdateDefault)(previous, resolved)) return;
    if (props.value === undefined) {
      setLocalValue(
        /** Store function-valued states without invoking them again. */
        () => resolved,
      );
    }
    props.onChange?.(resolved);
  }

  return [value, setValue];
}
