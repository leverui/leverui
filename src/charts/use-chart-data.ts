/** A fixed numeric domain, or one computed from the field's minimum and maximum. */
export type ChartValueDomain =
  readonly [number, number] | ((range: { min: number; max: number }) => readonly [number, number]);

/** Compare two field values: numerically when both are numbers, otherwise as text. */
export function chartValueOrder(left: unknown, right: unknown, direction: 'asc' | 'desc'): number {
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  const difference =
    Number.isFinite(leftNumber) && Number.isFinite(rightNumber)
      ? leftNumber - rightNumber
      : String(left).localeCompare(String(right));
  return direction === 'asc' ? difference : -difference;
}

/** Group entries by one field's value, keeping first-seen group order. */
export function groupChartData<T>(data: readonly T[], field: keyof T): T[][] {
  const groups = new Map<unknown, T[]>();
  for (const item of data) {
    const group = groups.get(item[field]) ?? [];
    group.push(item);
    groups.set(item[field], group);
  }
  return [...groups.values()];
}
