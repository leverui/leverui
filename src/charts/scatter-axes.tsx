import { For, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { scatterX, scatterY, type ScatterPlot } from './scatter-geometry';

/** Numeric axes and ticks for a scatter plot's two independent scales. */
export function ScatterAxes(props: {
  plot: ScatterPlot;
  xTicks?: readonly number[] | undefined;
  xFormatter?: ((value: number) => string) | undefined;
}): JSX.Element {
  /** Generate five evenly spaced x ticks when a story supplies none. */
  const xTicks = createMemo(
    /** Track the current horizontal domain while producing default ticks. */
    () => {
      const { xMin, xMax } = props.plot;
      return (
        props.xTicks ??
        Array.from(
          { length: 5 },
          /** Interpolate one tick across the current horizontal domain. */
          (_, index) => xMin + ((xMax - xMin) * index) / 4,
        )
      );
    },
  );
  /** Show the exact tick value unless a chart formatter replaces it. */
  function formatX(value: number): string {
    return props.xFormatter?.(value) ?? `${Number(value.toFixed(1))}`;
  }

  return (
    <g class="leverui-scatter-chart__axes" data-scatter-axes="">
      <line
        class="leverui-scatter-chart__axis-line"
        x1={props.plot.left}
        x2={props.plot.width - props.plot.right}
        y1={props.plot.height - props.plot.bottom}
        y2={props.plot.height - props.plot.bottom}
      />
      <line
        class="leverui-scatter-chart__axis-line"
        x1={props.plot.left}
        x2={props.plot.left}
        y1={props.plot.top}
        y2={props.plot.height - props.plot.bottom}
      />
      <For each={xTicks()}>
        {/** Mark one numeric position on the x axis. */}
        {(value) => (
          <g class="leverui-scatter-chart__tick">
            <line
              x1={scatterX(props.plot, value)}
              x2={scatterX(props.plot, value)}
              y1={props.plot.height - props.plot.bottom}
              y2={props.plot.height - props.plot.bottom + 6}
            />
            <text
              class="leverui-scatter-chart__tick-label"
              x={Math.min(scatterX(props.plot, value), props.plot.width - 18)}
              y={props.plot.height - props.plot.bottom + 16.5}
              text-anchor="middle"
            >
              {formatX(value)}
            </text>
          </g>
        )}
      </For>
      <For each={[0, 1, 2, 3, 4]}>
        {/** Mark one interval on the shared positive y axis. */}
        {(index) => {
          /** Read the value represented by this vertical tick. */
          const value = () => props.plot.yMin + ((props.plot.yMax - props.plot.yMin) * index) / 4;
          return (
            <g class="leverui-scatter-chart__tick">
              <line
                x1={props.plot.left - 5}
                x2={props.plot.left}
                y1={scatterY(props.plot, value())}
                y2={scatterY(props.plot, value())}
              />
              <text
                class="leverui-scatter-chart__tick-label"
                x={props.plot.left - 8}
                y={scatterY(props.plot, value()) + 4.25}
                text-anchor="end"
              >
                {Number(value().toFixed(1))}
              </text>
            </g>
          );
        }}
      </For>
    </g>
  );
}
