const cssLength =
  /^[+-]?[0-9]*\.?[0-9]+(?:[eE][+-]?[0-9]+)?(?:cm|mm|Q|in|pc|pt|px|em|ex|ch|rem|lh|rlh|vw|vh|vmin|vmax|vb|vi|svw|svh|lvw|lvh|dvw|dvh|cqw|cqh|cqi|cqb|cqmin|cqmax|%)$/;
const spacingKey = /^-?(?:\d+(?:\.\d+)?|[A-Za-z][A-Za-z0-9_.-]*)$/;
const cssKeyword = /^(?:normal|inherit|initial|unset|revert|revert-layer)$/;

/** Resolve a spacing token to its CSS variable while preserving CSS lengths. */
export function spacingCssValue(value: string | number): string {
  const raw = String(value);
  if (cssLength.test(raw) || cssKeyword.test(raw) || !spacingKey.test(raw)) return raw;
  const key = raw.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  return raw === '0' ? `var(--lui-spacing-${key}, 0)` : `var(--lui-spacing-${key})`;
}
