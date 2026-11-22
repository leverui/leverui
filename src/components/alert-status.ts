import type { ResponsiveValues } from '../styled-system/responsive-values';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';

const alertStatuses = ['info', 'warning', 'success', 'error', 'neutral'] as const;
export type AlertStatus = (typeof alertStatuses)[number];
const allowedStatuses = new Set<string>(alertStatuses);

/** Validate finite Alert statuses at supported breakpoints. */
export function readAlertStatus(value: unknown): ResponsiveValues<AlertStatus> {
  return readFiniteResponsiveChoice<AlertStatus>(value, allowedStatuses, 'info', 'Alert status');
}

/** Bind one Alert status per selected CSS breakpoint. */
export function alertStatusAttributes(
  selected: ResponsiveValues<AlertStatus>,
): Record<string, string | undefined> {
  return {
    'data-status': selected.base,
    'data-status-sm': selected.sm,
    'data-status-md': selected.md,
    'data-status-lg': selected.lg,
    'data-status-xl': selected.xl,
    'data-status-2xl': selected['2xl'],
  };
}

/** Accept a nonempty explicit palette name for authored Alert tokens. */
export function readAlertPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Alert colorPalette must be a nonempty string.');
  }
  return value.trim();
}
