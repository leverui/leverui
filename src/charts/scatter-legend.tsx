import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import type { ScatterSeries } from './scatter-chart-types';

/** Show color-coded series names under the plot. */
export function ScatterLegend(props: { series: readonly ScatterSeries[] }): JSX.Element {
  return (
    <div class="lui-scatter-chart__legend">
      <For each={props.series.slice().reverse()}>
        {/** Pair one series label with its color marker. */}
        {(series) => (
          <span class="lui-scatter-chart__legend-item">
            <span
              class="lui-scatter-chart__legend-swatch"
              style={{ background: chartColor(series.color, series.color) }}
            />
            {series.name}
          </span>
        )}
      </For>
    </div>
  );
}
