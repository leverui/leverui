import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import { barValue } from './bar-geometry';
import type { BarDatum, BarSeries } from './bar-chart-types';

/** Label each series color in the requested chart position. */
export function BarLegend(props: {
  series: readonly BarSeries[];
  placement: 'bottom' | 'top-right';
}): JSX.Element {
  return (
    <div class="leverui-bar-chart__legend" data-bar-legend="" data-placement={props.placement}>
      <For
        each={props.series.slice().sort(
          /** Sort legend labels alphabetically. */
          (left, right) => left.name.localeCompare(right.name),
        )}
      >
        {/** Pair one colored square with its visible series name. */}
        {(series) => (
          <span class="leverui-bar-chart__legend-item">
            <span
              class="leverui-bar-chart__legend-swatch"
              style={{
                '--lui-private-bar-chart-swatch': chartColor(series.color, series.color),
              }}
            />
            {series.name}
          </span>
        )}
      </For>
    </div>
  );
}

/** Explain the active category and values outside the chart SVG. */
export function BarTooltip(props: {
  row: BarDatum;
  xKey: string;
  series: readonly BarSeries[];
  labelFormatter?: ((row: BarDatum) => string) | undefined;
}): JSX.Element {
  return (
    <div class="leverui-bar-chart__tooltip" role="tooltip">
      <div class="leverui-bar-chart__tooltip-label">
        {props.labelFormatter?.(props.row) ?? String(props.row[props.xKey] ?? '')}
      </div>
      <For each={props.series}>
        {/** Show each source value for the selected category. */}
        {(series) => (
          <div class="leverui-bar-chart__tooltip-item">
            {series.name}: {barValue(props.row, series.name)}
          </div>
        )}
      </For>
    </div>
  );
}
