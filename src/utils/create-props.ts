type StrictKeys<K extends (keyof T)[], T> = K extends (keyof T)[]
  ? [keyof T] extends [K[number]]
    ? unknown
    : `Missing required keys: ${Exclude<keyof T, K[number]>}`
  : never;

/** Build a deduplicated prop-key list while checking required keys at compile time. */
export const createProps =
  /** Fix the prop shape before collecting its keys. */
  <T extends Record<never, never>>() =>
    /** Retain each supplied key once in declaration order. */
    <K extends (keyof T)[]>(props: K & StrictKeys<K, T>) =>
      Array.from(new Set(props));
