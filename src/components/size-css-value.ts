import { isCssUnit } from '../utils/unit';

const cssSizeKeyword =
  /^(?:auto|inherit|initial|unset|revert|revert-layer|max-content|min-content|fit-content)$/;
const tokenName = /^[a-zA-Z0-9_./-]+$/;

/** Resolve size tokens to public variables while preserving CSS dimensions. */
export function sizeCssValue(value: string | number): string {
  const raw = String(value);
  if (raw === '0' || isCssUnit(raw) || cssSizeKeyword.test(raw) || !tokenName.test(raw)) {
    return raw;
  }
  const key = raw.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  return `var(--leverui-sizes-${key})`;
}
