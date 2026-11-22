import { countries1 } from './select-virtual-countries-1';
import { countries2 } from './select-virtual-countries-2';
import { countries3 } from './select-virtual-countries-3';
import { countries4 } from './select-virtual-countries-4';

export const comboboxCountries = [...countries1, ...countries2, ...countries3, ...countries4];

/** Convert a two-letter country code to its regional-indicator flag. */
export function countryFlag(code: string): string {
  const first = code.codePointAt(0);
  const second = code.codePointAt(1);
  if (first === undefined || second === undefined) return '';
  return String.fromCodePoint(first + 127397, second + 127397);
}
