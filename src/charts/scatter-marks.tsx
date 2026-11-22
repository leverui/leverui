import { For, Show, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import { scatterX, scatterY, type ScatterDatum, type ScatterPlot } from './scatter-geometry';
import type { ScatterSeries } from './scatter-chart-types';

/** A valid data point selected for one named scatter series. */
export interface ScatterEntry {
  row: ScatterDatum;
  series: ScatterSeries;
  x: number;
  y: number;
}

/** Filter and project one series without modifying the caller's data. */
export function scatterEntries(
  data: readonly ScatterDatum[],
  series: ScatterSeries,
  xKey: string,
  yKey: string,
): ScatterEntry[] {
  return data.flatMap(
    /** Keep only rows in this group with finite x and y measurements. */
    (row) => {
      if (series.groupId !== undefined && row.id !== series.groupId) return [];
      const x = row[xKey];
      const y = row[yKey];
      return typeof x === 'number' &&
        Number.isFinite(x) &&
        typeof y === 'number' &&
        Number.isFinite(y)
        ? [{ row, series, x, y }]
        : [];
    },
  );
}

/** Draw optional connected segments and the points for one scatter group. */
export function ScatterMarks(props: {
  entries: readonly ScatterEntry[];
  plot: ScatterPlot;
  connectDots: boolean;
  onPointEnter: (entry: ScatterEntry) => void;
  onPointLeave: () => void;
}): JSX.Element {
  const line = createMemo(
    /** Preserve the source data order for connected dots. */
    () =>
      props.entries
        .map(
          /** Serialize one point into the connected SVG path. */
          (entry, index) =>
            `${index === 0 ? 'M' : 'L'}${scatterX(props.plot, entry.x)} ${scatterY(props.plot, entry.y)}`,
        )
        .join(' '),
  );
  return (
    <g class="leverui-scatter-chart__series" data-scatter-series={props.entries[0]?.series.name}>
      <Show when={props.connectDots && props.entries.length > 1}>
        <path class="leverui-scatter-chart__connection" d={line()} />
      </Show>
      <For each={props.entries}>
        {/** Draw a point with a hit target and a readable accessible label. */}
        {(entry) => {
          /** Select this measurement on pointer hover. */
          function enter(): void {
            props.onPointEnter(entry);
          }
          return (
            <circle
              class="leverui-scatter-chart__point"
              data-scatter-point=""
              cx={scatterX(props.plot, entry.x)}
              cy={scatterY(props.plot, entry.y)}
              r="4.5"
              fill={chartColor(entry.series.color, entry.series.color)}
              aria-label={`${entry.series.name}: ${entry.x}, ${entry.y}`}
              onPointerEnter={enter}
              onPointerLeave={props.onPointLeave}
            />
          );
        }}
      </For>
    </g>
  );
}
