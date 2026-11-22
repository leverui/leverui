export const textStyles = [
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  'label',
] as const;

/** A named typography preset from the default stylesheet. */
export type TextStyle = (typeof textStyles)[number];

export interface TextStyleProps {
  /** Apply a named font size, line height, and letter spacing preset. */
  textStyle?: TextStyle | undefined;
}

const allowedTextStyles = new Set<string>(textStyles);

/** Expose a validated text style as the attribute the stylesheet selects. */
export function textStyleAttributes(value: string | undefined): {
  'data-text-style'?: TextStyle;
} {
  if (value === undefined) return {};
  if (!allowedTextStyles.has(value)) throw new TypeError(`Text style is unsupported: ${value}.`);
  return { 'data-text-style': value as TextStyle };
}
