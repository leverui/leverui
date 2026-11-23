import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import { chartY } from './cartesian-geometry';
import type { CartesianPlot } from './cartesian-types';
import type { BarChartProps } from './bar-chart-types';

/** Highlight a value interval and target line behind the plotted bars. */
export function BarReferences(props: {
  plot: CartesianPlot;
  area: BarChartProps['referenceArea'];
  value: BarChartProps['referenceValue'];
}): JSX.Element {
  /** Bound a reference region to its two supplied values. */
  const areaTop = () =>
    Math.min(chartY(props.plot, props.area?.from ?? 0), chartY(props.plot, props.area?.to ?? 0));
  /** Keep the fill height nonnegative even when endpoints are reversed. */
  const areaHeight = () =>
    Math.abs(chartY(props.plot, props.area?.from ?? 0) - chartY(props.plot, props.area?.to ?? 0));
  return (
    <g class="lui-bar-chart__references" data-bar-references="" aria-hidden="true">
      <Show when={props.area}>
        {(area) => (
          <>
            <rect
              class="lui-bar-chart__reference-area"
              x={props.plot.left}
              y={areaTop()}
              width={props.plot.width - props.plot.left - props.plot.right}
              height={areaHeight()}
              style={{ fill: area().color ? chartColor(area().color, '') : undefined }}
            />
            <Show when={area().label}>
              <text
                class="lui-bar-chart__reference-label"
                x={props.plot.left + 5}
                y={areaTop() + 5}
              >
                {area().label}
              </text>
            </Show>
          </>
        )}
      </Show>
      <Show when={props.value}>
        {(value) => (
          <line
            class="lui-bar-chart__reference-line"
            x1={props.plot.left}
            x2={props.plot.width - props.plot.right}
            y1={chartY(props.plot, value().value)}
            y2={chartY(props.plot, value().value)}
            style={{ stroke: value().color ? chartColor(value().color, '') : undefined }}
          />
        )}
      </Show>
    </g>
  );
}
