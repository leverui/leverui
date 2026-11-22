/** Accept a nonempty scalar palette name for authored Status tokens. */
export function readStatusPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Status colorPalette must be a nonempty string.');
  }
  return value.trim();
}
