/** Initialize one stable value during a Solid component's setup. */
export function useConst<T>(initial: T | (() => T)): T {
  // A function argument is an initializer rather than a stored value.
  return typeof initial === 'function' ? (initial as () => T)() : initial;
}
