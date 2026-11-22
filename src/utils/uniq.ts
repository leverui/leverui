/** Preserve first-seen order while deduplicating groups of values. */
export const uniq = <T>(...items: T[][]): T[] => {
  const set = items.reduce<Set<T>>(
    /** Add each present group's values to the result set. */
    (acc, curr) => {
      if (curr != null)
        curr.forEach(
          /** Add one value without changing its first-seen position. */
          (item) => acc.add(item),
        );
      return acc;
    },
    new Set([]),
  );
  return Array.from(set);
};
