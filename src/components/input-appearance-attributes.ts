import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveBreakpoint,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import {
  isInputSize,
  isInputVariant,
  type InputChoice,
  type InputSize,
  type InputVariant,
} from './input-appearance-options';

/** Validate one finite Input appearance choice at supported breakpoints. */
function readChoice<T extends string>(
  value: InputChoice<T> | undefined,
  isAllowed: (candidate: string) => candidate is T,
  fallback: T,
  label: string,
  component: string,
): ResponsiveValues<T> {
  const choices = readResponsiveStrings(value);
  if (!choices)
    throw new TypeError(`${component} ${label} uses an unsupported breakpoint or value.`);
  const selected: ResponsiveValues<T> = {};
  let current = fallback;
  for (const breakpoint of responsiveBreakpoints) {
    const choice = choices[breakpoint];
    if (choice !== undefined) {
      if (!isAllowed(choice))
        throw new TypeError(`${component} ${label} is unsupported: ${choice}.`);
      current = choice;
    }
    selected[breakpoint] = current;
  }
  return selected;
}

type AttributeName =
  | `data-${'size' | 'variant'}`
  | `data-${'size' | 'variant'}-${Exclude<ResponsiveBreakpoint, 'base'>}`;

/** Bind validated Input appearance choices to native presentation attributes. */
export function inputAppearanceAttributes(
  size: InputChoice<InputSize> | undefined,
  variant: InputChoice<InputVariant> | undefined,
  component: string,
): Partial<Record<AttributeName, string | undefined>> {
  const selectedSize = readChoice(size, isInputSize, 'md', 'size', component);
  const selectedVariant = readChoice(variant, isInputVariant, 'outline', 'variant', component);
  return {
    'data-size': selectedSize.base,
    'data-size-sm': selectedSize.sm,
    'data-size-md': selectedSize.md,
    'data-size-lg': selectedSize.lg,
    'data-size-xl': selectedSize.xl,
    'data-size-2xl': selectedSize['2xl'],
    'data-variant': selectedVariant.base,
    'data-variant-sm': selectedVariant.sm,
    'data-variant-md': selectedVariant.md,
    'data-variant-lg': selectedVariant.lg,
    'data-variant-xl': selectedVariant.xl,
    'data-variant-2xl': selectedVariant['2xl'],
  };
}
