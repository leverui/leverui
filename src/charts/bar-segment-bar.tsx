import { splitProps } from '../primitives/utils/split-props';
import { For, Show, createUniqueId } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { useBarSegmentChart, type BarSegmentData } from './bar-segment-context';
import { chartSize } from './chart-size';
import { chartColor } from './chart-color';
import { barSegmentClass } from './bar-segment-class';
import { barSegmentNativeStyle } from './bar-segment-style';

/** Props for a hover or keyboard tooltip. */
export interface BarSegmentTooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
  payload: BarSegmentData;
}

/** Show one segment's name and formatted value on interaction. */
export function BarSegmentTooltip(props: BarSegmentTooltipProps): JSX.Element {
  const chart = useBarSegmentChart();
  const [local, native] = splitProps(props, ['payload', 'class', 'style', 'children']);
  /** Format the active segment in the current locale. */
  const format = (value: number): string =>
    chart().formatNumber({ maximumFractionDigits: 2 })(value);
  return (
    <Show when={chart().highlightedSeries === local.payload.name}>
      <div
        {...native}
        role="tooltip"
        class={barSegmentClass('tooltip', local.class)}
        style={local.style}
      >
        <span
          aria-hidden="true"
          class={barSegmentClass('tooltipSwatch')}
          style={{
            '--lui-private-bar-segment-color': chartColor(local.payload.color, 'currentColor'),
          }}
        />
        <span>{local.payload.name}</span>
        <strong>{format(local.payload.value)}</strong>
      </div>
    </Show>
  );
}

/** Props for a row of proportional colored segments. */
export interface BarSegmentBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  tooltip?: boolean | ((props: BarSegmentTooltipProps) => JSX.Element);
  gap?: string;
}

/** Render a proportional bar and optional tooltip for each data point. */
export function BarSegmentBar(props: BarSegmentBarProps): JSX.Element {
  const chart = useBarSegmentChart();
  const [local, native] = splitProps(props, ['tooltip', 'gap', 'class', 'style', 'children']);
  const tooltipPrefix = createUniqueId();
  return (
    <div
      {...native}
      class={barSegmentClass('bar', local.class)}
      style={
        local.gap === undefined
          ? local.style
          : barSegmentNativeStyle(
              { '--lui-bar-segment-bar-gap': chartSize(local.gap) },
              local.style,
            )
      }
    >
      <For each={chart().data}>
        {/** Keep each segment focusable when it has a tooltip. */}
        {(item, index) => {
          /** Reveal this segment's tooltip on hover or focus. */
          function enter(): void {
            if (local.tooltip) chart().setHighlightedSeries(item.name);
          }
          /** Dismiss this segment's tooltip after interaction. */
          function leave(): void {
            if (local.tooltip) chart().setHighlightedSeries(null);
          }
          return (
            <div
              onMouseEnter={enter}
              onMouseLeave={leave}
              onFocus={enter}
              onBlur={leave}
              tabindex={local.tooltip ? 0 : undefined}
              aria-label={local.tooltip ? `${item.name}: ${item.value}` : undefined}
              aria-describedby={local.tooltip === true ? `${tooltipPrefix}-${index()}` : undefined}
              class={barSegmentClass('segment')}
              style={{
                '--lui-private-bar-segment-flex': `${Math.max(0, item.value)} 1 0`,
                '--lui-private-bar-segment-color': chartColor(item.color, 'currentColor'),
              }}
            >
              <Show when={local.tooltip}>
                {typeof local.tooltip === 'function' ? (
                  local.tooltip({ payload: item })
                ) : (
                  <BarSegmentTooltip payload={item} id={`${tooltipPrefix}-${index()}`} />
                )}
              </Show>
            </div>
          );
        }}
      </For>
      {local.children}
    </div>
  );
}

/** Props for a marker crossing the proportional bar. */
export interface BarSegmentReferenceProps extends JSX.HTMLAttributes<HTMLDivElement> {
  value: number;
  label?: JSX.Element;
}

/** Place a reference marker at a fraction of the chart's total value. */
export function BarSegmentReference(props: BarSegmentReferenceProps): JSX.Element {
  const chart = useBarSegmentChart();
  const [local, native] = splitProps(props, ['value', 'label', 'class', 'style', 'children']);
  return (
    <div
      {...native}
      class={barSegmentClass('reference', local.class)}
      data-has-label={local.label ? '' : undefined}
      style={barSegmentNativeStyle(
        {
          left: `${chart().getValuePercent('value', local.value)}%`,
        },
        local.style,
      )}
    >
      <span class={barSegmentClass('referenceLine')} />
      {local.label && <span class={barSegmentClass('referenceLabel')}>{local.label}</span>}
    </div>
  );
}
