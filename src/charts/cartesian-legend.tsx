import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import type { CartesianSeries } from './cartesian-types';

/** Present chart series labels and theme colors at the chosen edge. */
export function CartesianLegend(props: {
  series: readonly CartesianSeries[];
  stacked: boolean;
  reverse: boolean;
  placement: 'bottom' | 'top-right';
  onHover?: ((name: string | null) => void) | undefined;
}): JSX.Element {
  /** Follow stack layering or an explicitly reversed legend order. */
  const entries = () =>
    props.stacked || props.reverse ? [...props.series].reverse() : props.series;
  return (
    <div class="lui-cartesian-chart__legend" data-placement={props.placement}>
      <For each={entries()}>
        {/** Pair one series label with its resolved color. */}
        {(series) => (
          <span
            class="lui-cartesian-chart__legendItem"
            role={props.onHover ? 'button' : undefined}
            tabindex={props.onHover ? '0' : undefined}
            onMouseEnter={
              /** Highlight this series while its legend label is hovered. */
              () => props.onHover?.(series.name)
            }
            onMouseLeave={
              /** Restore all series when the pointer leaves the label. */
              () => props.onHover?.(null)
            }
            onFocus={
              /** Give keyboard focus the same emphasis as pointer hover. */
              () => props.onHover?.(series.name)
            }
            onBlur={
              /** Restore series opacity when keyboard focus leaves. */
              () => props.onHover?.(null)
            }
            onClick={
              /** Activate the emphasized line from a pointer click. */
              () => props.onHover?.(series.name)
            }
            onKeyDown={
              /** Activate the emphasized line with a button key. */
              (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                props.onHover?.(series.name);
              }
            }
          >
            <span
              class="lui-cartesian-chart__legendSwatch"
              style={{
                '--lui-private-cartesian-color': chartColor(series.color, series.color),
              }}
            />
            {series.label ?? series.name}
          </span>
        )}
      </For>
    </div>
  );
}
