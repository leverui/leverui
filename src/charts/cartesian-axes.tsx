import { For, Show, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartX, chartY } from './cartesian-geometry';
import type { CartesianChartProps, CartesianPlot } from './cartesian-types';

/** Data and plot boundaries needed by grid and axis labels. */
export interface CartesianAxesProps {
  data: CartesianChartProps['data'];
  xKey: string;
  plot: CartesianPlot;
  showGrid: boolean;
  gridHorizontal: boolean;
  gridDashed: boolean;
  gridVertical: boolean;
  showYAxis: boolean;
  showXAxis: boolean;
  showAxisLines: boolean;
  xTickAngle: number;
  percent: boolean;
  xAxisLabel?: string | undefined;
  yAxisLabel?: string | undefined;
  xTickValues?: readonly string[] | undefined;
  xTickFormatter?: ((value: string) => string) | undefined;
  yTickFormatter?: ((value: number) => string) | undefined;
  yTickValues?: readonly number[] | undefined;
}

/** Draw chart grid lines, category ticks, and numeric axis labels. */
export function CartesianAxes(props: CartesianAxesProps): JSX.Element {
  const ticks = createMemo(
    /** Use explicit ticks or divide the visible domain into five intervals. */
    () => {
      if (props.yTickValues) return props.yTickValues;
      const { min, max } = props.plot;
      return Array.from(
        { length: 5 },
        /** Locate one evenly spaced numeric tick. */
        (_, index) => min + ((max - min) * index) / 4,
      );
    },
  );
  const categories = createMemo(
    /** Keep source category order while honoring an optional tick subset. */
    () =>
      props.data.flatMap(
        /** Select one category label and its original plot position. */
        (row, index) => {
          const value = String(row[props.xKey] ?? '');
          return !props.xTickValues || props.xTickValues.includes(value) ? [{ value, index }] : [];
        },
      ),
  );
  /** Read the plot's bottom edge, where the category axis sits. */
  const baseline = (): number => props.plot.height - props.plot.bottom;
  /** Anchor rotated labels at their tick so they read away from the axis. */
  const xAnchor = (): 'start' | 'middle' | 'end' =>
    props.xTickAngle < 0 ? 'end' : props.xTickAngle > 0 ? 'start' : 'middle';

  /** Format numeric ticks with a sensible default for percent charts. */
  function yLabel(value: number): string {
    if (props.yTickFormatter) return props.yTickFormatter(value);
    return props.percent ? `${Math.round(value * 100)}%` : `${Math.round(value)}`;
  }

  return (
    <g
      class="lui-cartesian-chart__axes"
      aria-hidden="true"
      data-grid-dashed={props.gridDashed ? '' : undefined}
    >
      <Show when={props.showGrid}>
        <For each={props.gridHorizontal ? ticks() : []}>
          {/** Span one numeric tick across the plot. */}
          {(tick) => (
            <line
              class="lui-cartesian-chart__gridLine"
              x1={props.plot.left}
              x2={props.plot.width - props.plot.right}
              y1={chartY(props.plot, tick)}
              y2={chartY(props.plot, tick)}
            />
          )}
        </For>
        <Show when={props.gridVertical}>
          <For each={categories()}>
            {/** Align one vertical grid line with its category. */}
            {(category) => (
              <line
                class="lui-cartesian-chart__gridLine"
                x1={chartX(props.plot, category.index, props.data.length)}
                x2={chartX(props.plot, category.index, props.data.length)}
                y1={props.plot.top}
                y2={props.plot.height - props.plot.bottom}
              />
            )}
          </For>
        </Show>
      </Show>
      <Show when={props.showAxisLines}>
        <line
          class="lui-cartesian-chart__axisLine"
          x1={props.plot.left}
          x2={props.plot.width - props.plot.right}
          y1={baseline()}
          y2={baseline()}
        />
        <For each={props.showXAxis ? categories() : []}>
          {/** Mark one category on the axis line. */}
          {(category) => (
            <line
              class="lui-cartesian-chart__axisLine"
              x1={chartX(props.plot, category.index, props.data.length)}
              x2={chartX(props.plot, category.index, props.data.length)}
              y1={baseline()}
              y2={baseline() + 6}
            />
          )}
        </For>
        <Show when={props.showYAxis}>
          <line
            class="lui-cartesian-chart__axisLine"
            x1={props.plot.left}
            x2={props.plot.left}
            y1={props.plot.top}
            y2={baseline()}
          />
        </Show>
      </Show>
      <Show when={props.showYAxis}>
        <For each={ticks()}>
          {/** Position one value label beside its grid line. */}
          {(tick) => (
            <text
              x={props.plot.left - 10}
              y={chartY(props.plot, tick)}
              text-anchor="end"
              dominant-baseline="middle"
            >
              {yLabel(tick)}
            </text>
          )}
        </For>
      </Show>
      <Show when={props.showXAxis}>
        <For each={categories()}>
          {/** Position one category label below the plot. */}
          {(category) => (
            <text
              x={chartX(props.plot, category.index, props.data.length)}
              y={baseline() + 22}
              text-anchor={xAnchor()}
              transform={
                props.xTickAngle
                  ? `rotate(${props.xTickAngle} ${chartX(props.plot, category.index, props.data.length)} ${baseline() + 22})`
                  : undefined
              }
            >
              {props.xTickFormatter?.(category.value) ?? category.value}
            </text>
          )}
        </For>
      </Show>
      <Show when={props.xAxisLabel}>
        <text
          class="lui-cartesian-chart__axisTitle"
          x={props.plot.width / 2}
          y={props.plot.height - 5}
          text-anchor="middle"
        >
          {props.xAxisLabel}
        </text>
      </Show>
      <Show when={props.yAxisLabel}>
        <text
          class="lui-cartesian-chart__axisTitle"
          transform={`translate(16 ${props.plot.height / 2}) rotate(-90)`}
          text-anchor="middle"
        >
          {props.yAxisLabel}
        </text>
      </Show>
    </g>
  );
}
