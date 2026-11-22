import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Sparkline as SparklineExport } from '../src/charts/sparkline';

export interface SparklineHydrationComponents {
  Sparkline: typeof SparklineExport;
}

const values = [{ value: 10 }, { value: 18 }, { value: 13 }] as const;

/** Share the responsive chart tree between published SSR and browser hydration. */
export function renderSparklineHydrationTree(
  components: SparklineHydrationComponents,
): JSX.Element {
  return createComponent(components.Sparkline, {
    data: values,
    width: '100%',
    gradient: true,
    'aria-label': 'Hydrated Sparkline',
  });
}
