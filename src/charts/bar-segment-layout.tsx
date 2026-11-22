import { splitProps } from '../primitives/utils/split-props';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { BarSegmentContext, useBarSegmentChart, type BarSegmentData } from './bar-segment-context';
import { chartSize } from './chart-size';
import { chartColor } from './chart-color';
import { barSegmentClass } from './bar-segment-class';
import { barSegmentNativeStyle } from './bar-segment-style';
import type { UseChartReturn } from './use-chart';

/** Native div attributes accepted by each public Bar Segment part. */
export type BarSegmentLayoutProps = JSX.HTMLAttributes<HTMLDivElement>;

/** Root props bind a colored data model and bar height. */
export interface BarSegmentRootProps extends BarSegmentLayoutProps {
  chart: UseChartReturn<BarSegmentData>;
  barSize?: string | undefined;
}

/** Provide chart state and spacing to Bar Segment pieces. */
export function BarSegmentRoot(props: BarSegmentRootProps): JSX.Element {
  /** Keep a changing chart model visible to nested pieces. */
  const chart = (): UseChartReturn<BarSegmentData> => props.chart;
  const [local, native] = splitProps(props, ['chart', 'barSize', 'class', 'style', 'children']);
  return (
    <BarSegmentContext value={chart}>
      <div
        {...native}
        class={barSegmentClass('root', local.class)}
        style={
          local.barSize === undefined
            ? local.style
            : barSegmentNativeStyle(
                { '--leverui-bar-segment-size': chartSize(local.barSize) },
                local.style,
              )
        }
      >
        {local.children}
      </div>
    </BarSegmentContext>
  );
}

/** Stack the labels, colored bar, and optional values. */
export function BarSegmentContent(props: BarSegmentLayoutProps): JSX.Element {
  const chart = useBarSegmentChart();
  const [local, native] = splitProps(props, ['onMouseLeave', 'class', 'style', 'children']);
  /** Clear any tooltip when the pointer leaves the whole chart. */
  function leave(event: MouseEvent & { currentTarget: HTMLDivElement; target: Element }): void {
    chart().setHighlightedSeries(null);
    const handler = local.onMouseLeave;
    if (typeof handler === 'function') handler(event);
    else if (handler) handler[0](handler[1], event);
  }
  return (
    <div
      {...native}
      onMouseLeave={leave}
      class={barSegmentClass('content', local.class)}
      style={local.style}
    >
      {local.children}
    </div>
  );
}

/** Render item names at the same proportional widths as their segments. */
export function BarSegmentLabel(props: BarSegmentLayoutProps): JSX.Element {
  const chart = useBarSegmentChart();
  const [local, native] = splitProps(props, ['class', 'style', 'children']);
  return (
    <div {...native} class={barSegmentClass('label', local.class)} style={local.style}>
      <For each={chart().data}>
        {/** Give each item name its proportional width. */}
        {(item) => (
          <div
            class={barSegmentClass('labelItem')}
            style={{
              '--leverui-private-bar-segment-percent': `${chart().getValuePercent('value', item.value)}%`,
            }}
          >
            {item.name}
          </div>
        )}
      </For>
    </div>
  );
}

/** Render a compact value above each colored segment. */
export function BarSegmentValue(props: BarSegmentLayoutProps): JSX.Element {
  const chart = useBarSegmentChart();
  const [local, native] = splitProps(props, ['class', 'style', 'children']);
  /** Format one amount using the current chart locale. */
  const format = (value: number): string =>
    chart().formatNumber({ notation: 'compact', maximumFractionDigits: 2 })(value);
  return (
    <div {...native} class={barSegmentClass('value', local.class)} style={local.style}>
      <For each={chart().data}>
        {/** Keep each value aligned with its segment. */}
        {(item) => (
          <div
            class={barSegmentClass('valueItem')}
            style={{
              '--leverui-private-bar-segment-percent': `${chart().getValuePercent('value', item.value)}%`,
            }}
          >
            {format(item.value)}
          </div>
        )}
      </For>
    </div>
  );
}

/** Props for the optional row of colored legend entries. */
export interface BarSegmentLegendProps extends BarSegmentLayoutProps {
  showPercent?: boolean;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  gap?: string;
  textStyle?: 'xs' | 'sm';
}

/** Show series names, swatches, and optional values or percentages. */
export function BarSegmentLegend(props: BarSegmentLegendProps): JSX.Element {
  const chart = useBarSegmentChart();
  const [local, native] = splitProps(props, [
    'showPercent',
    'showValue',
    'valueFormatter',
    'gap',
    'textStyle',
    'class',
    'style',
    'children',
  ]);
  /** Format a legend value when no consumer formatter is supplied. */
  const format = (value: number): string =>
    chart().formatNumber({ maximumFractionDigits: 2 })(value);
  return (
    <div
      {...native}
      class={barSegmentClass('legend', local.class)}
      data-text-style={local.textStyle ?? 'sm'}
      style={
        local.gap === undefined
          ? local.style
          : barSegmentNativeStyle(
              { '--leverui-bar-segment-legend-gap': chartSize(local.gap) },
              local.style,
            )
      }
    >
      <For each={chart().data}>
        {/** Pair a color swatch with the corresponding segment name. */}
        {(item) => (
          <div class={barSegmentClass('legendItem')}>
            <span
              aria-hidden="true"
              class={barSegmentClass('legendSwatch')}
              style={{
                '--leverui-private-bar-segment-color': chartColor(item.color, 'currentColor'),
              }}
            />
            <span class={barSegmentClass('legendText')}>
              <span>{item.name}</span>
              {local.showValue && (
                <strong>{local.valueFormatter?.(item.value) ?? format(item.value)}</strong>
              )}
              {local.showPercent && (
                <span class={barSegmentClass('legendPercent')}>
                  {chart().getValuePercent('value', item.value).toFixed(0)}%
                </span>
              )}
            </span>
          </div>
        )}
      </For>
    </div>
  );
}
