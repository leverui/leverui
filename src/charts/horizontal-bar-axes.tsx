import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { BarDatum } from './bar-chart-types';
import type { CartesianPlot } from './cartesian-types';

/** Draw category rows and a numeric bottom axis for horizontal bars. */
export function HorizontalBarAxes(props: {
  data: readonly BarDatum[];
  xKey: string;
  plot: CartesianPlot;
  showGrid: boolean;
  showYAxis: boolean;
  showXAxis: boolean;
  xTickFormatter?: ((value: string) => string) | undefined;
}): JSX.Element {
  /** Locate the center of a horizontal category band. */
  function center(index: number): number {
    return (
      props.plot.top +
      ((index + 0.5) * (props.plot.height - props.plot.top - props.plot.bottom)) / props.data.length
    );
  }
  /** Locate a numeric tick along the horizontal value scale. */
  function tickX(index: number): number {
    return props.plot.left + (index * (props.plot.width - props.plot.left - props.plot.right)) / 4;
  }
  /** Add the plot boundaries around its category-centered guides. */
  const gridY = () => [
    props.plot.top,
    ...props.data.map(
      /** Place one guide through each horizontal category. */
      (_, index) => center(index),
    ),
    props.plot.height - props.plot.bottom,
  ];
  return (
    <g class="leverui-bar-chart__axes" data-bar-axes="">
      <Show when={props.showGrid}>
        <For each={gridY()}>
          {/** Span each category center and both outer plot edges. */}
          {(y) => (
            <line
              class="leverui-bar-chart__grid-line"
              x1={props.plot.left}
              x2={props.plot.width - props.plot.right}
              y1={y}
              y2={y}
            />
          )}
        </For>
      </Show>
      <Show when={props.showYAxis}>
        <For each={props.data}>
          {/** Put the short category name beside its stacked bar. */}
          {(row, index) => {
            /** Read the category value without assuming it is a string. */
            const label = () => String(row[props.xKey] ?? '');
            return (
              <text
                class="leverui-bar-chart__tick"
                x={props.plot.left - 10}
                y={center(index())}
                text-anchor="end"
                dominant-baseline="middle"
              >
                {props.xTickFormatter?.(label()) ?? label()}
              </text>
            );
          }}
        </For>
      </Show>
      <Show when={props.showXAxis}>
        <For each={[0, 1, 2, 3, 4]}>
          {/** Label a fifth of the horizontal numeric domain. */}
          {(index) => (
            <text
              class="leverui-bar-chart__tick"
              x={tickX(index)}
              y={props.plot.height - props.plot.bottom + 22}
              text-anchor="middle"
            >
              {Math.round(props.plot.min + ((props.plot.max - props.plot.min) * index) / 4)}
            </text>
          )}
        </For>
      </Show>
    </g>
  );
}
