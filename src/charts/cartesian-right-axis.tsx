import { For, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartY } from './cartesian-geometry';
import type { CartesianPlot } from './cartesian-types';

/** Draw the independent value scale assigned to right-axis series. */
export function CartesianRightAxis(props: {
  plot: CartesianPlot;
  label?: string | undefined;
}): JSX.Element {
  /** Split the right-side domain into five readable tick positions. */
  const ticks = createMemo(
    /** Recalculate right-side ticks when its series domain changes. */
    () => {
      const { min, max } = props.plot;
      return Array.from(
        { length: 5 },
        /** Interpolate one numeric right-side tick. */
        (_, index) => min + ((max - min) * index) / 4,
      );
    },
  );
  return (
    <g class="leverui-cartesian-chart__rightAxis" data-chart-right-axis aria-hidden="true">
      <For each={ticks()}>
        {/** Position the alternate value label outside the plot. */}
        {(tick) => (
          <text
            x={props.plot.width - props.plot.right + 10}
            y={chartY(props.plot, tick)}
            dominant-baseline="middle"
          >
            {Math.round(tick)}
          </text>
        )}
      </For>
      <text
        class="leverui-cartesian-chart__axisTitle"
        transform={`translate(${props.plot.width - 15} ${props.plot.height / 2}) rotate(90)`}
        text-anchor="middle"
      >
        {props.label}
      </text>
    </g>
  );
}
