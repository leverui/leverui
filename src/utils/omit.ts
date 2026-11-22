/** Returns a shallow copy with the requested keys removed. */
export function omit<T extends Record<string, unknown>, K extends PropertyKey>(
  object: T,
  keysToOmit: K[] | readonly K[] = [],
) {
  const clone: Record<string, unknown> = { ...object };
  for (const key of keysToOmit) {
    if (key in clone) {
      delete clone[key as string];
    }
  }
  return clone as Omit<T, K>;
}
