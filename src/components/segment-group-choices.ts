import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export const segmentGroupSizes = ['xs', 'sm', 'md', 'lg'] as const;
export type SegmentGroupSize = (typeof segmentGroupSizes)[number];

export interface SegmentGroupAppearance {
  size?: FiniteResponsiveChoice<SegmentGroupSize> | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
}

const sizes = new Set<string>(segmentGroupSizes);

/** Keep Segment Group sizes on finite authored CSS selectors. */
export function readSegmentGroupSizes(value: unknown): ResponsiveValues<SegmentGroupSize> {
  return readFiniteResponsiveChoice(value, sizes, 'md', 'Segment Group size');
}
