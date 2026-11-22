import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export const skeletonVariants = ['pulse', 'shine', 'none'] as const;
export type SkeletonVariant = (typeof skeletonVariants)[number];
export type SkeletonVariantChoice =
  SkeletonVariant | readonly (SkeletonVariant | null)[] | ResponsiveValues<SkeletonVariant>;

/** Validate finite appearance choices at ordinary breakpoints. */
export function readSkeletonVariant(value: unknown): ResponsiveValues<SkeletonVariant> {
  const parsed = readResponsiveStrings(value);
  if (!parsed) throw new TypeError('Skeleton variant uses an unsupported breakpoint or value.');
  const result: ResponsiveValues<SkeletonVariant> = { base: 'pulse' };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = parsed[breakpoint];
    if (choice === undefined) continue;
    if (choice !== 'pulse' && choice !== 'shine' && choice !== 'none') {
      throw new TypeError(`Skeleton variant is unsupported: ${choice}.`);
    }
    result[breakpoint] = choice;
  }
  return result;
}
