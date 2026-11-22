import { For, Show, createMemo, createSignal, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';

/** One named, color-coded measurement in a chart tooltip. */
export interface ChartTooltipItem {
  name: string;
  value: string | number | undefined;
  color: string;
}

/** Position and content inputs shared by radar and radial tooltips. */
export interface ChartTooltipCardProps {
  label?: string;
  items: readonly ChartTooltipItem[];
  pointer: { x: number; y: number };
  chartWidth: number;
  chartHeight: number;
}

/** Show a compact value card beside the active chart position. */
export function ChartTooltipCard(props: ChartTooltipCardProps): JSX.Element {
  let element: HTMLDivElement | undefined;
  const [size, setSize] = createSignal({ width: 128, height: 44 });
  const position = createMemo(
    /** Flip the card when its measured size reaches a chart edge. */
    () => {
      const gap = 10;
      const right = props.pointer.x + gap;
      const bottom = props.pointer.y + gap;
      return {
        x: Math.max(
          0,
          right + size().width > props.chartWidth ? props.pointer.x - size().width - gap : right,
        ),
        y: Math.max(
          0,
          bottom + size().height > props.chartHeight
            ? props.pointer.y - size().height - gap
            : bottom,
        ),
      };
    },
  );
  /** Track card dimensions when a label or value changes. */
  function observeSize(): (() => void) | undefined {
    if (!element) return undefined;
    const observer = new ResizeObserver(
      /** Keep position accurate after the card resizes. */
      () => {
        if (element) setSize({ width: element.offsetWidth, height: element.offsetHeight });
      },
    );
    observer.observe(element);
    /** Release the browser observer with its tooltip. */
    return () => observer.disconnect();
  }
  onSettled(observeSize);

  return (
    <div
      ref={element}
      role="tooltip"
      class="leverui-chart-tooltip"
      style={{
        left: `${position().x}px`,
        top: `${position().y}px`,
      }}
    >
      <Show when={props.label}>
        <p class="leverui-chart-tooltip__label">{props.label}</p>
      </Show>
      <div>
        <For each={props.items}>
          {/** Pair each swatch and muted name with its formatted value. */}
          {(item) => (
            <div class="leverui-chart-tooltip__item">
              <span
                class="leverui-chart-tooltip__swatch"
                style={{
                  '--leverui-private-chart-tooltip-swatch': chartColor(item.color, item.color),
                }}
              />
              <div class="leverui-chart-tooltip__values">
                <span class="leverui-chart-tooltip__name">{item.name}</span>
                <span class="leverui-chart-tooltip__value">{item.value?.toLocaleString()}</span>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
