import type { ResponsiveCssValue } from '../styled-system/responsive-values';

export const inputSizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
export const inputVariants = ['outline', 'subtle', 'flushed'] as const;

export type InputSize = (typeof inputSizes)[number];
export type InputVariant = (typeof inputVariants)[number];
export type InputChoice<T extends string> = ResponsiveCssValue<T>;

/** Recognize only Input sizes backed by authored CSS. */
export function isInputSize(value: string): value is InputSize {
  return inputSizes.some(
    /** Compare a candidate with one finite size. */
    (size) => size === value,
  );
}

/** Recognize only Input treatments backed by authored CSS. */
export function isInputVariant(value: string): value is InputVariant {
  return inputVariants.some(
    /** Compare a candidate with one finite treatment. */
    (variant) => variant === value,
  );
}
