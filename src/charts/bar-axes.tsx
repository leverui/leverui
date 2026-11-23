import { For, Show, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartY } from './cartesian-geometry';
import type { CartesianPlot } from './cartesian-types';
import type { BarDatum } from './bar-chart-types';

/** Draw band-centered categories and configured numeric-axis ticks. */
export function BarAxes(props: {
  data: readonly BarDatum[];
  xKey: string;
  plot: CartesianPlot;
  showGrid: boolean;
  verticalGrid: boolean;
  gridDashed: boolean;
  showAxisLines: boolean;
  showYAxis: boolean;
  yAxisPlacement: 'left' | 'right';
  showXAxis: boolean;
  percent: boolean;
  xTickFormatter?: ((value: string) => string) | undefined;
  xTickEvery?: number | undefined;
  xTickRenderer?: ((row: BarDatum, index: number, x: number, y: number) => JSX.Element) | undefined;
  xAxisLabel?: string | undefined;
  yAxisLabel?: string | undefined;
  yTickFormatter?: ((value: number) => string) | undefined;
  yTickValues?: readonly number[] | undefined;
}): JSX.Element {
  const ticks = createMemo(
    /** Use explicit ticks or recalculate four numeric intervals. */
    () => {
      if (props.yTickValues) return props.yTickValues;
      const { min, max } = props.plot;
      return Array.from(
        { length: 5 },
        /** Interpolate one value tick across the visible domain. */
        (_, index) => min + ((max - min) * index) / 4,
      );
    },
  );
  /** Position a category in the middle of its allocated band. */
  function center(index: number): number {
    return (
      props.plot.left +
      ((index + 0.5) * (props.plot.width - props.plot.left - props.plot.right)) / props.data.length
    );
  }
  /** Format a numeric tick for the selected scale. */
  function formatY(value: number): string {
    if (props.yTickFormatter) return props.yTickFormatter(value);
    return props.percent ? `${Math.round(value * 100)}%` : `${Math.round(value)}`;
  }
  /** Center the rotated numeric-axis title within the plot. */
  const yAxisLabelY = () => (props.plot.top + props.plot.height - props.plot.bottom) / 2;

  return (
    <g
      class="lui-bar-chart__axes"
      data-bar-axes=""
      data-grid-dashed={props.gridDashed ? '' : undefined}
    >
      <Show when={props.showGrid}>
        <For each={ticks()}>
          {/** Span one numeric tick across all category bands. */}
          {(tick) => (
            <line
              class="lui-bar-chart__grid-line"
              x1={props.plot.left}
              x2={props.plot.width - props.plot.right}
              y1={chartY(props.plot, tick)}
              y2={chartY(props.plot, tick)}
            />
          )}
        </For>
      </Show>
      <Show when={props.verticalGrid}>
        <For each={props.data}>
          {/** Place a guide at each visible category tick. */}
          {(_, index) => (
            <Show when={index() % (props.xTickEvery ?? 1) === 0}>
              <line
                class="lui-bar-chart__grid-line"
                x1={center(index())}
                x2={center(index())}
                y1={props.plot.top}
                y2={props.plot.height - props.plot.bottom}
              />
            </Show>
          )}
        </For>
      </Show>
      <Show when={props.showAxisLines}>
        <path
          class="lui-bar-chart__axis-line"
          d={`M ${props.plot.left} ${props.plot.top} V ${props.plot.height - props.plot.bottom} H ${props.plot.width - props.plot.right}`}
        />
      </Show>
      <Show when={props.showYAxis}>
        <For each={ticks()}>
          {/** Align one numeric label with its horizontal grid line. */}
          {(tick) => (
            <text
              class="lui-bar-chart__tick"
              x={
                props.yAxisPlacement === 'right'
                  ? props.plot.width - props.plot.right + 9
                  : props.plot.left - 9
              }
              y={chartY(props.plot, tick)}
              text-anchor={props.yAxisPlacement === 'right' ? 'start' : 'end'}
              dominant-baseline="middle"
            >
              {formatY(tick)}
            </text>
          )}
        </For>
      </Show>
      <Show when={props.showXAxis}>
        <For each={props.data}>
          {/** Label one category at the center of its bar group. */}
          {(row, index) => {
            /** Avoid leaking numeric or tuple values into category labels. */
            const value = () => row[props.xKey];
            /** Convert the source category into a visible axis label. */
            const label = () => {
              const raw = value();
              return typeof raw === 'string' ? raw : String(raw ?? '');
            };
            return (
              <Show when={index() % (props.xTickEvery ?? 1) === 0}>
                {props.xTickRenderer ? (
                  props.xTickRenderer(
                    row,
                    index(),
                    center(index()),
                    props.plot.height - props.plot.bottom + 22,
                  )
                ) : (
                  <text
                    class="lui-bar-chart__tick"
                    x={center(index())}
                    y={props.plot.height - props.plot.bottom + 22}
                    text-anchor="middle"
                  >
                    {props.xTickFormatter?.(label()) ?? label()}
                  </text>
                )}
              </Show>
            );
          }}
        </For>
      </Show>
      <Show when={props.xAxisLabel}>
        <text
          class="lui-bar-chart__axis-label"
          x={(props.plot.left + props.plot.width - props.plot.right) / 2}
          y={props.plot.height - 15}
          text-anchor="middle"
        >
          {props.xAxisLabel}
        </text>
      </Show>
      <Show when={props.yAxisLabel}>
        <text
          class="lui-bar-chart__axis-label"
          x={props.plot.left - 55}
          y={yAxisLabelY()}
          text-anchor="start"
          dominant-baseline="middle"
          transform={`rotate(-90 ${props.plot.left - 55} ${yAxisLabelY()})`}
        >
          {props.yAxisLabel}
        </text>
      </Show>
    </g>
  );
}
