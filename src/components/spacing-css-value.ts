import { isCssUnit } from '../utils/unit';

// A token name is a number, or a name that may start with digits, such as `2xs`.
const spacingKey = /^-?(?:\d+(?:\.\d+)?|\d*[A-Za-z][A-Za-z0-9_.-]*)$/;
const cssKeyword = /^(?:normal|inherit|initial|unset|revert|revert-layer)$/;

/** Resolve a spacing token to its CSS variable while preserving CSS lengths. */
export function spacingCssValue(value: string | number): string {
  const raw = String(value);
  if (isCssUnit(raw) || cssKeyword.test(raw) || !spacingKey.test(raw)) return raw;
  const key = raw.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  return raw === '0' ? `var(--lui-spacing-${key}, 0)` : `var(--lui-spacing-${key})`;
}
