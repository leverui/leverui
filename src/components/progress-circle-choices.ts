import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export const progressCircleSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type ProgressCircleSize = (typeof progressCircleSizes)[number];

export interface ProgressCircleAppearance {
  size?: FiniteResponsiveChoice<ProgressCircleSize> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
}

const sizes = new Set<string>(progressCircleSizes);

/** Keep Circle sizes on finite CSS breakpoints. */
export function readProgressCircleSizes(value: unknown): ResponsiveValues<ProgressCircleSize> {
  return readFiniteResponsiveChoice(value, sizes, 'md', 'Progress Circle size');
}

/** Keep named or consumer-defined palettes on the native root. */
export function readProgressCirclePalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError('Progress Circle colorPalette must be a nonempty string.');
  }
  return value.trim();
}
