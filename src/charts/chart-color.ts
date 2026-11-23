/** Resolve a chart color token while preserving raw CSS colors. */
export function chartColor(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  return /^[a-z]+\.[a-z0-9-]+$/.test(value)
    ? `var(--lui-colors-${value.replace('.', '-')})`
    : value;
}
