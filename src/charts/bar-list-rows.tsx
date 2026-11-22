import { splitProps } from '../primitives/utils/split-props';
import { For, Show, createSignal, createUniqueId } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { useBarListChart, type BarListData } from './bar-list-context';
import { barListClass } from './bar-list-class';
import { chartColor } from './chart-color';

/** Props supplied to a custom Bar List label. */
export interface BarListItemProps {
  payload: BarListData;
  index: number;
}

/** Props supplied to a custom Bar List tooltip. */
export interface BarListTooltipProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  payload: BarListData;
  labelFormatter?: (value: number) => JSX.Element;
}

/** Props for the row label and optional hover value. */
export interface BarListBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  label?: (props: BarListItemProps) => JSX.Element;
  tooltip?: boolean | ((props: BarListTooltipProps) => JSX.Element);
}

/** Show the hovered row's full numeric value. */
export function BarListTooltip(props: BarListTooltipProps): JSX.Element {
  const chart = useBarListChart();
  const [local, native] = splitProps(props, [
    'payload',
    'labelFormatter',
    'class',
    'style',
    'children',
  ]);
  /** Format the current chart value with locale-aware separators. */
  const formatter = (value: number): string => chart().formatNumber({ style: 'decimal' })(value);
  return (
    <Show when={chart().highlightedSeries === local.payload.name}>
      <span
        {...native}
        role="tooltip"
        class={barListClass('tooltip', local.class)}
        style={local.style}
      >
        {local.labelFormatter?.(local.payload.value) ?? formatter(local.payload.value)}
      </span>
    </Show>
  );
}

/** Render one horizontal bar and name for every chart datum. */
export function BarListBar(props: BarListBarProps): JSX.Element {
  const chart = useBarListChart();
  const [local, native] = splitProps(props, ['label', 'tooltip', 'class', 'style', 'children']);
  const tooltipPrefix = createUniqueId();
  const [hoveredRow, setHoveredRow] = createSignal<string | null>(null);
  return (
    <div {...native} class={barListClass('bar', local.class)} style={local.style}>
      <For each={chart().data}>
        {/** Render each bar with mouse and keyboard tooltip access. */}
        {(item, index) => {
          /** Highlight the row only when its tooltip is enabled. */
          function enter(): void {
            setHoveredRow(item.name);
            if (local.tooltip) chart().setHighlightedSeries(item.name);
          }
          /** Clear the tooltip on row exit. */
          function leave(): void {
            setHoveredRow(null);
            if (local.tooltip) chart().setHighlightedSeries(null);
          }
          return (
            <div
              onMouseEnter={enter}
              onMouseLeave={leave}
              onFocus={enter}
              onBlur={leave}
              tabindex={local.tooltip ? 0 : undefined}
              aria-describedby={local.tooltip === true ? `${tooltipPrefix}-${index()}` : undefined}
              class={barListClass('row')}
              data-hovered={hoveredRow() === item.name ? '' : undefined}
            >
              <div
                class={barListClass('fill')}
                style={{
                  '--leverui-private-bar-list-width': `${chart().getValuePercent('value', item.value, [0, chart().getMax('value')])}%`,
                  '--leverui-private-bar-list-color': chartColor(
                    chart().series.find(
                      /** Use the series assigned to item names regardless of ordering. */
                      (series) => series.name === 'name',
                    )?.color,
                    'var(--leverui-colors-teal-subtle)',
                  ),
                }}
              />
              <Show when={local.tooltip}>
                {typeof local.tooltip === 'function' ? (
                  local.tooltip({ payload: item })
                ) : (
                  <BarListTooltip payload={item} id={`${tooltipPrefix}-${index()}`} />
                )}
              </Show>
              <div class={barListClass('rowLabel')}>
                {local.label?.({ payload: item, index: index() }) ?? item.name}
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}

/** Props for a column of formatted Bar List values. */
export interface BarListValueProps extends JSX.HTMLAttributes<HTMLDivElement> {
  valueFormatter?: (value: number) => JSX.Element;
}

/** Render one right aligned value for each bar row. */
export function BarListValue(props: BarListValueProps): JSX.Element {
  const chart = useBarListChart();
  const [local, native] = splitProps(props, ['valueFormatter', 'class', 'style', 'children']);
  /** Format a value with the chart's current locale. */
  const formatter = (value: number): string =>
    chart().formatNumber({ notation: 'compact', maximumFractionDigits: 2 })(value);
  return (
    <div {...native} class={barListClass('value', local.class)} style={local.style}>
      <For each={chart().data}>
        {/** Align one formatted value with its matching bar. */}
        {(item) => (
          <div class={barListClass('valueRow')}>
            {local.valueFormatter?.(item.value) ?? formatter(item.value)}
          </div>
        )}
      </For>
    </div>
  );
}
