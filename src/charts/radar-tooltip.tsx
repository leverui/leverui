import { type JSX } from '@solidjs/web';
import { ChartTooltipCard } from './chart-tooltip-card';
import type { RadarSeries } from './radar-chart-types';
import type { RadarDatum, RadarPoint } from './radar-geometry';

/** Inputs needed to place the radar tooltip beside the current pointer. */
export interface RadarTooltipProps {
  datum: RadarDatum;
  series: readonly RadarSeries[];
  pointer: RadarPoint;
  chartWidth: number;
  chartHeight: number;
}

/** Adapt radar series values to the shared chart tooltip card. */
export function RadarTooltip(props: RadarTooltipProps): JSX.Element {
  return (
    <ChartTooltipCard
      label={props.datum.label}
      items={props.series.map(
        /** Preserve each displayed series and its own theme color. */
        (series) => ({
          name: series.name,
          value: props.datum[series.name],
          color: series.color,
        }),
      )}
      pointer={props.pointer}
      chartWidth={props.chartWidth}
      chartHeight={props.chartHeight}
    />
  );
}
