import { type JSX } from '@solidjs/web';
import { ChartTooltipCard } from './chart-tooltip-card';
import { scatterX, scatterY, type ScatterPlot } from './scatter-geometry';
import type { ScatterEntry } from './scatter-marks';

/** Explain both coordinates beside the selected scatter measurement. */
export function ScatterTooltip(props: { entry: ScatterEntry; plot: ScatterPlot }): JSX.Element {
  return (
    <ChartTooltipCard
      items={[
        { name: props.entry.series.name, value: props.entry.x, color: props.entry.series.color },
        { name: props.entry.series.name, value: props.entry.y, color: props.entry.series.color },
      ]}
      pointer={{ x: scatterX(props.plot, props.entry.x), y: scatterY(props.plot, props.entry.y) }}
      chartWidth={props.plot.width}
      chartHeight={props.plot.height}
    />
  );
}
