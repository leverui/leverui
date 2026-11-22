/** Returns a shallow copy without properties whose value is undefined. */
export function compact<T extends object>(object: T): T {
  const clone = { ...object };
  for (const key in clone) {
    if (clone[key] === undefined) delete clone[key];
  }
  return clone;
}
