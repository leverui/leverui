import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export const ratingGroupSizes = ['xs', 'sm', 'md', 'lg'] as const;
export type RatingGroupSize = (typeof ratingGroupSizes)[number];

export interface RatingGroupAppearance {
  size?: FiniteResponsiveChoice<RatingGroupSize> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
}

const sizes = new Set<string>(ratingGroupSizes);

/** Keep Rating Group sizing on finite authored CSS selectors. */
export function readRatingGroupSizes(value: unknown): ResponsiveValues<RatingGroupSize> {
  return readFiniteResponsiveChoice(value, sizes, 'md', 'Rating Group size');
}
