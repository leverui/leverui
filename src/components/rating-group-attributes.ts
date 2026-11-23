import { readRatingGroupSizes, type RatingGroupAppearance } from './rating-group-choices';

/** Reject empty palette selections before they reach a CSS scope. */
function readRatingGroupPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError('Rating Group colorPalette must be a nonempty string.');
  }
  return value.trim();
}

/** Reflect finite Rating Group choices on its native primitive root. */
export function ratingGroupAttributes(appearance: RatingGroupAppearance): {
  'data-size': string | undefined;
  'data-size-sm': string | undefined;
  'data-size-md': string | undefined;
  'data-size-lg': string | undefined;
  'data-size-xl': string | undefined;
  'data-size-2xl': string | undefined;
  'data-lui-color-palette': string | undefined;
  'data-unstyled': string | undefined;
} {
  const sizes = readRatingGroupSizes(appearance.size);
  return {
    'data-size': sizes.base,
    'data-size-sm': sizes.sm,
    'data-size-md': sizes.md,
    'data-size-lg': sizes.lg,
    'data-size-xl': sizes.xl,
    'data-size-2xl': sizes['2xl'],
    'data-lui-color-palette': readRatingGroupPalette(appearance.colorPalette),
    'data-unstyled': appearance.unstyled ? '' : undefined,
  };
}
