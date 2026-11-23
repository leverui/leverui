import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import { chartX, chartY } from './cartesian-geometry';
import type { CartesianChartProps, CartesianPlot } from './cartesian-types';

/** Data and guides needed to render a highlighted chart interval. */
export interface CartesianReferencesProps {
  data: CartesianChartProps['data'];
  xKey: string;
  plot: CartesianPlot;
  lines?: CartesianChartProps['referenceLines'];
  area?: CartesianChartProps['referenceArea'];
  value?: CartesianChartProps['referenceValue'];
  point?: CartesianChartProps['referencePoint'];
}

/** Draw reference lines and a shaded category interval behind chart series. */
export function CartesianReferences(props: CartesianReferencesProps): JSX.Element {
  /** Find one category's original row index. */
  function indexOf(value: string): number {
    return props.data.findIndex(
      /** Match the displayed category key. */
      (row) => String(row[props.xKey]) === value,
    );
  }
  /** Locate a category inside the current plot. */
  function x(value: string): number {
    return chartX(props.plot, indexOf(value), props.data.length);
  }
  /** Resolve the current guide color. */
  function color(value?: string): string {
    return chartColor(value, 'var(--lui-colors-red-solid)');
  }
  return (
    <g class="lui-cartesian-chart__references" aria-hidden="true">
      <Show when={props.area && indexOf(props.area.x1) >= 0 && indexOf(props.area.x2) >= 0}>
        <rect
          class="lui-cartesian-chart__referenceArea"
          x={Math.min(x(props.area?.x1 ?? ''), x(props.area?.x2 ?? ''))}
          y={props.plot.top}
          width={Math.abs(x(props.area?.x2 ?? '') - x(props.area?.x1 ?? ''))}
          height={props.plot.height - props.plot.bottom - props.plot.top}
          fill={color(props.area?.color)}
        />
        <Show when={props.area?.label}>
          <text
            class="lui-cartesian-chart__referenceLabel"
            x={(x(props.area?.x1 ?? '') + x(props.area?.x2 ?? '')) / 2}
            y={props.plot.top + 18}
            text-anchor="middle"
          >
            {props.area?.label}
          </text>
        </Show>
      </Show>
      <For each={props.lines ?? []}>
        {/** Mark one named category with a vertical guide. */}
        {(line) => (
          <Show when={indexOf(line.x) >= 0}>
            <line
              class="lui-cartesian-chart__referenceLine"
              x1={x(line.x)}
              x2={x(line.x)}
              y1={props.plot.top}
              y2={props.plot.height - props.plot.bottom}
              stroke={color(line.color)}
            />
            <Show when={line.label}>
              <text
                class="lui-cartesian-chart__referenceLabel"
                x={x(line.x) + 5}
                y={props.plot.top + 16}
              >
                {line.label}
              </text>
            </Show>
          </Show>
        )}
      </For>
      <Show when={props.value && Number.isFinite(props.value.y)}>
        <line
          class="lui-cartesian-chart__referenceValue"
          x1={props.plot.left}
          x2={props.plot.width - props.plot.right}
          y1={chartY(props.plot, props.value?.y ?? 0)}
          y2={chartY(props.plot, props.value?.y ?? 0)}
          stroke={color(props.value?.color)}
          stroke-dasharray={props.value?.strokeDasharray}
        />
        <Show when={props.value?.label}>
          <text
            class="lui-cartesian-chart__referenceValueLabel"
            x={props.plot.width - props.plot.right}
            y={chartY(props.plot, props.value?.y ?? 0) - 10}
            text-anchor="end"
            fill={color(props.value?.color)}
          >
            {props.value?.label}
          </text>
        </Show>
      </Show>
      <Show when={props.point && indexOf(props.point.x) >= 0 && Number.isFinite(props.point.y)}>
        <circle
          class="lui-cartesian-chart__referencePoint"
          cx={x(props.point?.x ?? '')}
          cy={chartY(props.plot, props.point?.y ?? 0)}
          r={props.point?.radius ?? 6}
          fill={color(props.point?.color)}
        />
      </Show>
    </g>
  );
}
