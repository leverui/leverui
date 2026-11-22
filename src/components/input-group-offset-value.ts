/** Parse a numeric spacing choice while leaving CSS lengths untouched. */
export function numericInputGroupOffset(value: string | number): number | undefined {
  if (typeof value === 'number') return value;
  return /^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value) ? Number(value) : undefined;
}
