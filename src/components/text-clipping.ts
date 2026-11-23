import { type JSX } from '@solidjs/web';

export type TextClamp = { kind: 'value'; value: string } | { kind: 'none' } | undefined;

/** Accept a finite positive line count or an explicit clamp reset. */
export function readTextClamp(value: unknown): TextClamp {
  if (value === undefined) return undefined;
  if (value === 'none') return { kind: 'none' };
  if (typeof value === 'number') {
    if (Number.isInteger(value) && value > 0) return { kind: 'value', value: String(value) };
  }
  if (typeof value === 'string' && /^[1-9]\d*$/.test(value)) {
    return { kind: 'value', value };
  }
  throw new TypeError('Text lineClamp must be a positive integer or "none".');
}

/** Accept a Boolean truncation choice without silently ignoring CSS objects. */
export function readTextTruncate(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  throw new TypeError('Text truncate must be a Boolean.');
}

/** Keep the native style while supplying a checked line count to authored CSS. */
export function textClippingStyle(
  style: JSX.CSSProperties | string | false | undefined,
  clamp: TextClamp,
): JSX.CSSProperties | string | undefined {
  if (style === false) style = undefined;
  if (clamp?.kind !== 'value') return style;
  const variable = '--lui-private-text-line-clamp';
  if (typeof style === 'string') {
    const separator = style.trimEnd().endsWith(';') || style.length === 0 ? '' : ';';
    return `${style}${separator}${variable}:${clamp.value};`;
  }
  return { ...style, [variable]: clamp.value };
}
