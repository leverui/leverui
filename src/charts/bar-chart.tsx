import { splitProps } from '../primitives/utils/split-props';
import { Show, createMemo, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { BarAxes } from './bar-axes';
import { barChartKeys } from './bar-chart-native';
import { dispatchChartNativeEvent } from './chart-native-event';
import type { BarRect } from './bar-geometry';
import { barChartPlot } from './bar-chart-plot';
import { BarMarks } from './bar-marks';
import { BarLegend, BarTooltip } from './bar-overlays';
import { BarReferences } from './bar-references';
import { HorizontalBarAxes } from './horizontal-bar-axes';
import type { BarChartProps } from './bar-chart-types';
import { useCartesianWidth } from './cartesian-width';

export type { BarChartProps, BarDatum, BarSeries } from './bar-chart-types';

/** Draw grouped or stacked category bars in a responsive Solid SVG. */
export function BarChart(props: BarChartProps): JSX.Element {
  let container: HTMLDivElement | undefined;
  const [, native] = splitProps(props, barChartKeys);
  const [nativeLocal, forwarded] = splitProps(native, [
    'class',
    'className',
    'style',
    'ref',
    'onFocus',
    'onBlur',
    'onKeyDown',
  ]);
  const width = useCartesianWidth(
    /** Measure this chart's actual container after it mounts. */
    () => container,
  );
  const [activeIndex, setActiveIndex] = createSignal<number | null>(null);
  /** Enable keyboard navigation only when a tooltip can respond. */
  const interactive = () => props.tooltip === true && props.data.length > 0;
  const plot = createMemo(
    /** Recompute frame and numeric domain from reactive chart inputs. */
    () => barChartPlot(props, width()),
  );
  /** Select the first category when a keyboard user enters the chart. */
  function focus(event: FocusEvent & { currentTarget: HTMLDivElement; target: Element }): void {
    if (interactive()) setActiveIndex(0);
    dispatchChartNativeEvent(nativeLocal.onFocus, event);
  }
  /** Close the active category tooltip on blur or pointer exit. */
  function clear(): void {
    setActiveIndex(null);
  }
  /** Preserve a caller's blur handler after closing the tooltip. */
  function blur(event: FocusEvent & { currentTarget: HTMLDivElement; target: Element }): void {
    clear();
    dispatchChartNativeEvent(nativeLocal.onBlur, event);
  }
  /** Move the active category with arrow keys or dismiss its tooltip. */
  function keyDown(
    event: KeyboardEvent & { currentTarget: HTMLDivElement; target: Element },
  ): void {
    if (interactive()) {
      if (event.key === 'Escape') clear();
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const step = event.key === 'ArrowRight' ? 1 : -1;
        setActiveIndex(Math.max(0, Math.min(props.data.length - 1, (activeIndex() ?? 0) + step)));
      }
    }
    dispatchChartNativeEvent(nativeLocal.onKeyDown, event);
  }
  /** Open the hovered bar's category tooltip. */
  function enter(rect: BarRect): void {
    if (props.tooltip) setActiveIndex(rect.rowIndex);
  }

  return (
    <div
      {...forwarded}
      ref={
        /** Share the responsive chart container with a consumer native ref. */
        (element) => {
          container = element;
          const external = nativeLocal.ref;
          if (typeof external === 'function') external(element);
        }
      }
      class={['lui-bar-chart', nativeLocal.class, nativeLocal.className]}
      style={nativeLocal.style}
      data-orientation={props.orientation ?? 'vertical'}
      data-legend-placement={props.showLegend ? (props.legendPlacement ?? 'bottom') : undefined}
      data-interactive={interactive() ? '' : undefined}
      data-unstyled={props.unstyled ? '' : undefined}
      role={interactive() ? 'group' : native.role}
      tabindex={interactive() ? '0' : native.tabindex}
      aria-label={
        interactive()
          ? `${props['aria-label'] ?? 'Bar chart'}; use arrow keys to inspect categories`
          : props['aria-label']
      }
      onFocus={focus}
      onBlur={blur}
      onKeyDown={keyDown}
    >
      <svg
        class="lui-bar-chart__svg"
        role="img"
        aria-label={props['aria-label'] ?? 'Bar chart'}
        width={plot().width}
        height={plot().height}
        viewBox={`0 0 ${plot().width} ${plot().height}`}
      >
        <Show
          when={props.orientation === 'horizontal'}
          fallback={
            <BarAxes
              data={props.data}
              xKey={props.xKey}
              plot={plot()}
              showGrid={props.showGrid !== false}
              verticalGrid={props.verticalGrid === true}
              gridDashed={props.gridDashed === true}
              showAxisLines={props.showAxisLines === true}
              showYAxis={props.showYAxis !== false}
              yAxisPlacement={props.yAxisPlacement ?? 'left'}
              showXAxis={props.showXAxis !== false}
              percent={props.percent === true}
              xTickFormatter={props.xTickFormatter}
              xTickEvery={props.xTickEvery}
              xTickRenderer={props.xTickRenderer}
              xAxisLabel={props.xAxisLabel}
              yAxisLabel={props.yAxisLabel}
              yTickFormatter={props.yTickFormatter}
              yTickValues={props.yTickValues}
            />
          }
        >
          <HorizontalBarAxes
            data={props.data}
            xKey={props.xKey}
            plot={plot()}
            showGrid={props.showGrid !== false}
            showXAxis={props.showXAxis !== false}
            showYAxis={props.showYAxis !== false}
            xTickFormatter={props.xTickFormatter}
          />
        </Show>
        <BarReferences plot={plot()} area={props.referenceArea} value={props.referenceValue} />
        <BarMarks chart={props} plot={plot()} onBarEnter={enter} onBarLeave={clear} />
      </svg>
      <Show when={props.showLegend}>
        <BarLegend series={props.series} placement={props.legendPlacement ?? 'bottom'} />
      </Show>
      <Show when={props.tooltip && props.data[activeIndex() ?? -1]}>
        {/** Show values only while the selected category still exists. */}
        {(row) => (
          <BarTooltip
            row={row()}
            xKey={props.xKey}
            series={props.series}
            labelFormatter={props.tooltipLabelFormatter}
          />
        )}
      </Show>
    </div>
  );
}
