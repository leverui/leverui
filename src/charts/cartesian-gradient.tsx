import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartY } from './cartesian-geometry';
import type { CartesianPlot } from './cartesian-types';

/** Dynamic area gradient inputs shared by each rendered series. */
export interface CartesianGradientProps {
  id: string;
  color: string;
  plot: CartesianPlot;
  valueGradient: boolean;
}

/** Draw a theme-colored or zero-crossing area fill gradient. */
export function CartesianGradient(props: CartesianGradientProps): JSX.Element {
  /** Place the color transition at the current zero baseline. */
  const zeroOffset = (): string =>
    `${((chartY(props.plot, 0) - props.plot.top) / (props.plot.height - props.plot.bottom - props.plot.top)) * 100}%`;
  return (
    <defs>
      <linearGradient
        id={props.id}
        x1="0"
        x2="0"
        y1={props.plot.top}
        y2={props.plot.height - props.plot.bottom}
        gradientUnits="userSpaceOnUse"
      >
        <Show
          when={props.valueGradient}
          fallback={
            <>
              <stop
                class="leverui-cartesian-chart__gradientStart"
                offset="0%"
                stop-color={props.color}
              />
              <stop
                class="leverui-cartesian-chart__gradientEnd"
                offset="100%"
                stop-color={props.color}
              />
            </>
          }
        >
          <stop offset="0%" stop-color={props.color} />
          <stop offset={zeroOffset()} stop-color={props.color} />
          <stop offset={zeroOffset()} stop-color="var(--lui-colors-red-solid)" />
          <stop offset="100%" stop-color="var(--lui-colors-red-solid)" />
        </Show>
      </linearGradient>
    </defs>
  );
}
