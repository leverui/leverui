import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveCssValue,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export const nativeSelectSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export const nativeSelectVariants = ['outline', 'subtle', 'plain', 'ghost'] as const;

export type NativeSelectSize = (typeof nativeSelectSizes)[number];
export type NativeSelectVariant = (typeof nativeSelectVariants)[number];
export type NativeSelectChoice<T extends string> = ResponsiveCssValue<T>;

/** Recognize one finite Native Select size backed by authored CSS. */
function isSize(value: string): value is NativeSelectSize {
  return nativeSelectSizes.some(
    /** Compare a candidate with one supported size. */
    (size) => size === value,
  );
}

/** Recognize one finite Native Select treatment backed by authored CSS. */
function isVariant(value: string): value is NativeSelectVariant {
  return nativeSelectVariants.some(
    /** Compare a candidate with one supported treatment. */
    (variant) => variant === value,
  );
}

/** Carry an appearance choice across the supported media breakpoints. */
function readChoice<T extends string>(
  value: NativeSelectChoice<T> | undefined,
  isAllowed: (candidate: string) => candidate is T,
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const choices = readResponsiveStrings(value);
  if (!choices) throw new TypeError(`NativeSelect ${label} uses an unsupported breakpoint.`);
  const selected: ResponsiveValues<T> = {};
  let current = fallback;
  for (const breakpoint of responsiveBreakpoints) {
    const choice = choices[breakpoint];
    if (choice !== undefined) {
      if (!isAllowed(choice))
        throw new TypeError(`NativeSelect ${label} is unsupported: ${choice}.`);
      current = choice;
    }
    selected[breakpoint] = current;
  }
  return selected;
}

/** Bind finite root choices to responsive native attributes. */
export function nativeSelectAttributes(
  size: NativeSelectChoice<NativeSelectSize> | undefined,
  variant: NativeSelectChoice<NativeSelectVariant> | undefined,
): Record<string, string | undefined> {
  const sizes = readChoice(size, isSize, 'md', 'size');
  const variants = readChoice(variant, isVariant, 'outline', 'variant');
  return {
    'data-size': sizes.base,
    'data-size-sm': sizes.sm,
    'data-size-md': sizes.md,
    'data-size-lg': sizes.lg,
    'data-size-xl': sizes.xl,
    'data-size-2xl': sizes['2xl'],
    'data-variant': variants.base,
    'data-variant-sm': variants.sm,
    'data-variant-md': variants.md,
    'data-variant-lg': variants.lg,
    'data-variant-xl': variants.xl,
    'data-variant-2xl': variants['2xl'],
  };
}
