import type { ResponsiveValues } from '../styled-system/responsive-values';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';

const alertVariants = ['subtle', 'surface', 'outline', 'solid'] as const;
export type AlertVariant = (typeof alertVariants)[number];
const allowedVariants = new Set<string>(alertVariants);

/** Validate finite Alert variants at supported breakpoints. */
export function readAlertVariant(value: unknown): ResponsiveValues<AlertVariant> {
  return readFiniteResponsiveChoice<AlertVariant>(
    value,
    allowedVariants,
    'subtle',
    'Alert variant',
  );
}

/** Bind one Alert variant per selected CSS breakpoint. */
export function alertVariantAttributes(
  selected: ResponsiveValues<AlertVariant>,
): Record<string, string | undefined> {
  return {
    'data-variant': selected.base,
    'data-variant-sm': selected.sm,
    'data-variant-md': selected.md,
    'data-variant-lg': selected.lg,
    'data-variant-xl': selected.xl,
    'data-variant-2xl': selected['2xl'],
  };
}
