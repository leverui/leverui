import { createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChartTooltipCard } from './chart-tooltip-card';
import type { ChartDisplaySize } from './chart-display-size';
import type { RadialDatum } from './radial-geometry';

/** Position and source value of the active radial sector. */
export interface RadialChartTooltipProps {
  datum: RadialDatum;
  pointer: { x: number; y: number };
  display: ChartDisplaySize;
}

/** Show the active sector's name and value beside its pointer. */
export function RadialChartTooltip(props: RadialChartTooltipProps): JSX.Element {
  const items = createMemo(
    /** Keep tooltip content reactive when keyboard focus changes sectors. */
    () => [{ name: props.datum.name, value: props.datum.value, color: props.datum.color }],
  );
  return (
    <ChartTooltipCard
      items={items()}
      pointer={props.pointer}
      chartWidth={props.display.width}
      chartHeight={props.display.height}
    />
  );
}
