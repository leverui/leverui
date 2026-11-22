import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import type { RadarSeries } from './radar-chart-types';

/** Explain the color of each visible radar series below the plot. */
export function RadarLegend(props: { series: readonly RadarSeries[] }): JSX.Element {
  return (
    <div class="leverui-radar-chart__legend">
      <For each={props.series.slice().reverse()}>
        {/** Pair a small square marker with its series name. */}
        {(series) => (
          <span class="leverui-radar-chart__legend-item">
            <span
              class="leverui-radar-chart__legend-swatch"
              style={{ background: chartColor(series.color, series.color) }}
            />
            {series.name}
          </span>
        )}
      </For>
    </div>
  );
}
