import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import type { RadialDatum } from './radial-geometry';

/** Inputs for the compact legend beneath a radial chart's sectors. */
export interface RadialChartLegendProps {
  data: readonly RadialDatum[];
}

/** Draw the reversed radial legend inside its chart area. */
export function RadialChartLegend(props: RadialChartLegendProps): JSX.Element {
  return (
    <div class="leverui-radial-chart__legend">
      <For each={[...props.data].reverse()}>
        {/** Pair each legend swatch with its source series name. */}
        {(item) => (
          <span class="leverui-radial-chart__legendItem">
            <span
              class="leverui-radial-chart__legendSwatch"
              style={{
                '--lui-private-radial-legend-color': chartColor(item.color, item.color),
              }}
            />
            {item.name}
          </span>
        )}
      </For>
    </div>
  );
}
