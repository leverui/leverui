/** Deeply copies arrays and object own properties while preserving prototypes. */
export function clone<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.map(
      /** Recursively clone an array member. */
      (item: unknown) => clone(item),
    ) as T;
  }
  const copy = Object.create(Object.getPrototypeOf(value)) as Record<string, unknown>;
  for (const key of Object.keys(value)) {
    copy[key] = clone(Reflect.get(value, key));
  }
  return copy as T;
}
