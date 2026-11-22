import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { SkeletonVariant } from './skeleton-choices';

/** Reflect appearance choices for the authored breakpoint selectors. */
export function skeletonVariantAttributes(values: ResponsiveValues<SkeletonVariant>): {
  'data-variant': SkeletonVariant | undefined;
  'data-variant-sm': SkeletonVariant | undefined;
  'data-variant-md': SkeletonVariant | undefined;
  'data-variant-lg': SkeletonVariant | undefined;
  'data-variant-xl': SkeletonVariant | undefined;
  'data-variant-2xl': SkeletonVariant | undefined;
} {
  return {
    'data-variant': values.base,
    'data-variant-sm': values.sm,
    'data-variant-md': values.md,
    'data-variant-lg': values.lg,
    'data-variant-xl': values.xl,
    'data-variant-2xl': values['2xl'],
  };
}
