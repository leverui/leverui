/** Resolve a numeric spacing token while leaving native CSS lengths intact. */
export function chartSize(value: string): string {
  if (/^\d+$/.test(value)) {
    return `var(--leverui-spacing-${value}, ${Number(value) * 0.25}rem)`;
  }
  return /^\d+\.\d+$/.test(value) ? `${Number(value) * 0.25}rem` : value;
}
