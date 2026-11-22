import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { UseChartReturn } from './use-chart';

/** One colored section of a Bar Segment chart. */
export interface BarSegmentData {
  name: string;
  value: number;
  color: string;
}

export const BarSegmentContext = createOptionalContext<Accessor<UseChartReturn<BarSegmentData>>>();

/** Require a Bar Segment root around each chart piece. */
export function useBarSegmentChart(): Accessor<UseChartReturn<BarSegmentData>> {
  const chart = useOptionalContext(BarSegmentContext);
  if (!chart) throw new Error('BarSegment components must be inside BarSegment.Root');
  return chart;
}
