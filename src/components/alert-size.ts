import type { ResponsiveValues } from '../styled-system/responsive-values';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';

const alertSizes = ['sm', 'md', 'lg'] as const;
export type AlertSize = (typeof alertSizes)[number];
const allowedSizes = new Set<string>(alertSizes);

/** Validate finite Alert sizes at supported responsive breakpoints. */
export function readAlertSize(value: unknown): ResponsiveValues<AlertSize> {
  return readFiniteResponsiveChoice<AlertSize>(value, allowedSizes, 'md', 'Alert size');
}

/** Bind selected Alert sizes to stable native attributes. */
export function alertSizeAttributes(
  selected: ResponsiveValues<AlertSize>,
): Record<string, string | undefined> {
  return {
    'data-size': selected.base,
    'data-size-sm': selected.sm,
    'data-size-md': selected.md,
    'data-size-lg': selected.lg,
    'data-size-xl': selected.xl,
    'data-size-2xl': selected['2xl'],
  };
}
