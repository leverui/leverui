import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

/** List every size supported by the authored swatch stylesheet. */
export const colorSwatchSizes = [
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  'inherit',
  'full',
] as const;
/** List every shape supported by the authored swatch stylesheet. */
export const colorSwatchShapes = ['square', 'circle', 'rounded'] as const;
export type ColorSwatchSize = (typeof colorSwatchSizes)[number];
export type ColorSwatchShape = (typeof colorSwatchShapes)[number];

/** Narrow a string to one of the stylesheet's finite choices. */
function isChoice<T extends string>(value: string, allowed: readonly T[]): value is T {
  for (const option of allowed) {
    if (option === value) return true;
  }
  return false;
}

/** Validate a finite swatch choice at ordinary breakpoints. */
function readChoice<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const parsed = readResponsiveStrings(value);
  if (!parsed) throw new TypeError(`ColorSwatch ${label} uses an unsupported breakpoint or value.`);
  const result: ResponsiveValues<T> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = parsed[breakpoint];
    if (choice === undefined) continue;
    if (!isChoice(choice, allowed)) {
      throw new TypeError(`ColorSwatch ${label} is unsupported: ${choice}.`);
    }
    result[breakpoint] = choice;
  }
  return result;
}

/** Read all appearance choices without invoking a recipe runtime. */
export function readColorSwatchChoices(
  size: unknown,
  shape: unknown,
): {
  size: ResponsiveValues<ColorSwatchSize>;
  shape: ResponsiveValues<ColorSwatchShape>;
} {
  return {
    size: readChoice(size, colorSwatchSizes, 'md', 'size'),
    shape: readChoice(shape, colorSwatchShapes, 'rounded', 'shape'),
  };
}
