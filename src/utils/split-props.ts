type KeyPredicate<T extends object> = (key: keyof T) => boolean;

/** Split enumerable own properties by a list of keys. */
export function splitProps<T extends object, K extends keyof T>(
  props: T,
  keys: readonly K[],
): [Pick<T, K>, Omit<T, K>];

/** Split enumerable own properties according to a key predicate. */
export function splitProps<T extends object>(
  props: T,
  predicate: KeyPredicate<T>,
): [Partial<T>, Partial<T>];

/** Partition props without mutating the input object. */
export function splitProps<T extends object>(
  props: T,
  keysOrPredicate: readonly (keyof T)[] | KeyPredicate<T>,
): [Partial<T>, Partial<T>] {
  const picked = Object.create(null) as Partial<T>;
  const rest = Object.create(null) as Partial<T>;
  const matches: KeyPredicate<T> =
    typeof keysOrPredicate === 'function'
      ? keysOrPredicate
      : /** Check membership in the requested key list. */
        (key) => keysOrPredicate.includes(key);

  for (const key of Object.keys(props) as (keyof T)[]) {
    if (matches(key)) {
      picked[key] = props[key];
    } else {
      rest[key] = props[key];
    }
  }
  return [picked, rest];
}
