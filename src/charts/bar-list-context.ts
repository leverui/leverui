import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { UseChartReturn } from './use-chart';

/** Values rendered by the Bar List composition. */
export interface BarListData {
  name: string;
  value: number;
  href?: string;
}

export const BarListContext = createOptionalContext<Accessor<UseChartReturn<BarListData>>>();

/** Require a chart supplied by the nearest Bar List root. */
export function useBarListChart(): Accessor<UseChartReturn<BarListData>> {
  const chart = useOptionalContext(BarListContext);
  if (!chart) throw new Error('BarList components must be inside BarList.Root');
  return chart;
}
