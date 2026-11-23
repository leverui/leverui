import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import type { RadialBarDatum } from './radial-bar-geometry';

/** Render the named color swatches beneath a concentric bar chart. */
export function RadialBarLegend(props: { data: readonly RadialBarDatum[] }): JSX.Element {
  return (
    <div class="leverui-radial-bar-chart__legend">
      <For each={props.data}>
        {/** Pair each month with its radial bar color. */}
        {(datum) => (
          <span class="leverui-radial-bar-chart__legendItem">
            <span
              class="leverui-radial-bar-chart__legendSwatch"
              style={{ '--lui-private-radial-bar-color': chartColor(datum.color, datum.color) }}
            />
            {datum.name}
          </span>
        )}
      </For>
    </div>
  );
}
