import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export type TagsInputSize = 'xs' | 'sm' | 'md' | 'lg';
export type TagsInputVariant = 'outline' | 'subtle' | 'flushed';
export type TagsInputSizeChoice = FiniteResponsiveChoice<TagsInputSize>;
export type TagsInputVariantChoice = FiniteResponsiveChoice<TagsInputVariant>;

const sizes = new Set<string>(['xs', 'sm', 'md', 'lg']);
const variants = new Set<string>(['outline', 'subtle', 'flushed']);

/** Reflect finite size and variant choices for static component CSS. */
export function tagsInputAppearanceAttributes(
  size: unknown,
  variant: unknown,
): Record<string, string | undefined> {
  const selectedSize = readFiniteResponsiveChoice<TagsInputSize>(
    size,
    sizes,
    'md',
    'Tags Input size',
  );
  const selectedVariant = readFiniteResponsiveChoice<TagsInputVariant>(
    variant,
    variants,
    'outline',
    'Tags Input variant',
  );
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
