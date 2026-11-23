import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { cartesianActiveIndex } from './cartesian-active-index';
import { chartX } from './cartesian-geometry';
import { chartColor } from './chart-color';
import type { CartesianChartProps, CartesianPlot } from './cartesian-types';

/** Props for the accessible pointer and keyboard interaction layer. */
export interface CartesianInteractionProps {
  data: CartesianChartProps['data'];
  series: CartesianChartProps['series'];
  xKey: string;
  plot: CartesianPlot;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  tooltip: boolean;
  tooltipContent?: CartesianChartProps['tooltipContent'];
}

/** Map pointer movement to the nearest category. */
export function CartesianInteraction(props: CartesianInteractionProps): JSX.Element {
  /** Ignore a stale category after reactive data shrinks. */
  const selectedIndex = (): number | null =>
    cartesianActiveIndex(props.activeIndex, props.data.length);
  /** Select a category from the pointer's position inside the plot. */
  function move(event: PointerEvent): void {
    const bounds = (event.currentTarget as SVGRectElement).getBoundingClientRect();
    const fraction = bounds.width > 0 ? (event.clientX - bounds.left) / bounds.width : 0;
    const index = Math.round(fraction * (props.data.length - 1));
    props.setActiveIndex(Math.max(0, Math.min(props.data.length - 1, index)));
  }
  /** Dismiss the active category after pointer exit or blur. */
  function leave(): void {
    props.setActiveIndex(null);
  }
  return (
    <>
      <rect
        class="leverui-cartesian-chart__interaction"
        x={props.plot.left}
        y={props.plot.top}
        width={props.plot.width - props.plot.left - props.plot.right}
        height={props.plot.height - props.plot.top - props.plot.bottom}
        onPointerMove={move}
        onPointerLeave={leave}
      />
      <Show when={selectedIndex() !== null}>
        <line
          class="leverui-cartesian-chart__cursor"
          x1={chartX(props.plot, selectedIndex() ?? 0, props.data.length)}
          x2={chartX(props.plot, selectedIndex() ?? 0, props.data.length)}
          y1={props.plot.top}
          y2={props.plot.height - props.plot.bottom}
          aria-hidden="true"
        />
      </Show>
    </>
  );
}

/** Show the selected category and all of its numeric series values. */
export function CartesianTooltip(props: CartesianInteractionProps): JSX.Element {
  /** Ignore a stale category after reactive data shrinks. */
  const selectedIndex = (): number | null =>
    cartesianActiveIndex(props.activeIndex, props.data.length);
  /** Delegate content to a consumer renderer when the active row exists. */
  function customContent(): JSX.Element | undefined {
    const row = props.data[selectedIndex() ?? -1];
    return row && props.tooltipContent ? props.tooltipContent(row, props.series) : undefined;
  }
  return (
    <Show when={props.tooltip && selectedIndex() !== null}>
      <Show
        when={customContent()}
        fallback={
          <div
            class="leverui-cartesian-chart__tooltip"
            role="tooltip"
            style={{
              left: `${Math.min(props.plot.width - 135, chartX(props.plot, selectedIndex() ?? 0, props.data.length) + 12)}px`,
            }}
          >
            <strong>{String(props.data[selectedIndex() ?? -1]?.[props.xKey] ?? '')}</strong>
            <For each={props.series}>
              {/** Show one color-coded value for the active category. */}
              {(series) => (
                <div class="leverui-cartesian-chart__tooltipItem">
                  <span
                    class="leverui-cartesian-chart__tooltipSwatch"
                    style={{
                      '--lui-private-cartesian-color': chartColor(series.color, series.color),
                    }}
                  />
                  <span>
                    {series.label ?? series.name}:{' '}
                    {props.data[selectedIndex() ?? -1]?.[series.name] ?? '—'}
                  </span>
                </div>
              )}
            </For>
          </div>
        }
      >
        {/** Preserve a custom tooltip's own semantic and visual structure. */}
        {(content) => content()}
      </Show>
    </Show>
  );
}
