import { splitProps } from '../primitives/utils/split-props';
import { For, Show, createMemo, createSignal, createUniqueId } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import { displayedChartPoint, useChartDisplaySize } from './chart-display-size';
import { chartRootStyle } from './chart-root-style';
import { ChartTooltipCard } from './chart-tooltip-card';
import { radialBarEntries, radialBarLabelPath } from './radial-bar-geometry';
import { RadialBarLegend } from './radial-bar-legend';
import type { RadialBarChartProps } from './radial-bar-chart-types';
import { radialBarChartKeys, runRadialEvent } from './radial-native';

export type { RadialBarChartProps } from './radial-bar-chart-types';

/** Draw theme-aware concentric value bars with optional labels and legend. */
export function RadialBarChart(props: RadialBarChartProps): JSX.Element {
  const [, native] = splitProps(props, radialBarChartKeys);
  let svgRef: SVGSVGElement | undefined;
  const labelId = createUniqueId();
  let pointerFocus = false;
  const [activeIndex, setActiveIndex] = createSignal<number | null>(null);
  /** Use a landscape responsive chart until size is specified. */
  const width = () => props.size ?? 352;
  /** Preserve square geometry when the caller supplies an explicit size. */
  const height = () => props.size ?? 264;
  const displaySize = useChartDisplaySize(() => svgRef, width, height);
  /** Center circles vertically inside a landscape SVG. */
  const verticalOffset = () =>
    props.size === undefined ? height() / 2 - width() / 2 : -width() / 20;
  /** Move the first ring outward when numeric labels are shown. */
  const innerRadius = () => props.innerRadius ?? (props.label ? 31.75 : props.legend ? 1 : 2);
  /** Use smaller rings when labeled. */
  const barSize = () => props.barSize ?? (props.label ? 14 : 20);
  /** Preserve visible separation between adjacent rings. */
  const gap = () => props.gap ?? (props.label ? 3.5 : props.legend ? 2.6 : 5.4);
  const entries = createMemo(
    /** Recompute paths whenever source values or ring dimensions change. */
    () =>
      radialBarEntries(props.data, width() / 2, innerRadius(), barSize(), gap(), props.maxValue),
  );
  const activeEntry = createMemo(
    /** Resolve the active source ring without assuming every datum is valid. */
    () => entries().find((entry) => entry.index === activeIndex()),
  );
  /** Expose keyboard navigation only when a value tooltip can appear. */
  const interactive = () => props.tooltip !== false && entries().length > 0;
  /** Activate the first ring when keyboard navigation enters the chart. */
  function focus(): void {
    if (pointerFocus) return;
    if (interactive()) setActiveIndex(entries()[0]?.index ?? null);
  }
  /** Keep pointer focus from replacing the ring selected by hover. */
  function pointerDown(): void {
    pointerFocus = true;
  }
  /** Restore keyboard focus handling after the pointer completes its press. */
  function pointerUp(): void {
    pointerFocus = false;
  }
  /** Hide the active tooltip when focus or pointer leaves. */
  function clear(): void {
    setActiveIndex(null);
  }
  /** Reset pointer ownership when keyboard focus leaves the chart. */
  function blur(): void {
    pointerFocus = false;
    clear();
  }
  /** Move the active ring with arrow keys or dismiss its tooltip. */
  function keyDown(event: KeyboardEvent): void {
    if (!interactive()) return;
    if (event.key === 'Escape') return clear();
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const current = entries().findIndex((entry) => entry.index === activeIndex());
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = Math.max(0, Math.min(entries().length - 1, current + step));
    setActiveIndex(entries()[next]?.index ?? null);
  }

  return (
    <div
      {...native}
      ref={props.ref}
      class={['lui-radial-bar-chart', props.class, props.className]}
      data-label={props.label ? '' : undefined}
      data-legend={props.legend ? '' : undefined}
      role={interactive() ? 'group' : props.role}
      aria-label={
        interactive()
          ? `${props['aria-label'] ?? 'Radial bar chart'}; use arrow keys`
          : props['aria-label']
      }
      tabindex={interactive() ? '0' : props.tabindex}
      onFocus={
        /** Preserve consumer focus handling. */ (event) =>
          runRadialEvent(event, focus, props.onFocus)
      }
      onPointerDown={
        /** Preserve consumer pointer handling. */ (event) =>
          runRadialEvent(event, pointerDown, props.onPointerDown)
      }
      onPointerUp={
        /** Preserve consumer pointer release. */ (event) =>
          runRadialEvent(event, pointerUp, props.onPointerUp)
      }
      onPointerCancel={
        /** Preserve consumer pointer cancel. */ (event) =>
          runRadialEvent(event, pointerUp, props.onPointerCancel)
      }
      onPointerLeave={
        /** Preserve consumer pointer leave. */ (event) =>
          runRadialEvent(event, pointerUp, props.onPointerLeave)
      }
      onBlur={
        /** Preserve consumer blur handling. */ (event) => runRadialEvent(event, blur, props.onBlur)
      }
      onKeyDown={
        /** Preserve consumer keyboard handling. */ (event) =>
          runRadialEvent(event, keyDown, props.onKeyDown)
      }
      style={chartRootStyle('--lui-private-radial-bar-size', props.size, props.style)}
    >
      <svg
        ref={svgRef}
        class="lui-radial-bar-chart__svg"
        role="img"
        aria-label={props['aria-label'] ?? 'Radial bar chart'}
        width={width()}
        height={height()}
        viewBox={`0 0 ${width()} ${height()}`}
      >
        <g transform={`translate(0 ${verticalOffset()})`}>
          <For each={entries()}>
            {/** Draw the background track and value arc for one concentric ring. */}
            {(entry) => (
              <g class="lui-radial-bar-chart__ring" data-radial-bar={entry.datum.name}>
                <path class="lui-radial-bar-chart__track" d={entry.background} />
                <path
                  class="lui-radial-bar-chart__value"
                  d={entry.foreground}
                  fill={chartColor(entry.datum.color, entry.datum.color)}
                  onPointerEnter={
                    /** Show the ring's value when its colored arc is hovered. */
                    () => setActiveIndex(entry.index)
                  }
                  onPointerLeave={clear}
                />
                <Show when={props.label}>
                  <text
                    class="lui-radial-bar-chart__label"
                    dominant-baseline="central"
                    pointer-events="none"
                  >
                    <defs>
                      <path
                        id={`lui-radial-label-${labelId}-${entry.index}`}
                        d={radialBarLabelPath(width() / 2, entry.radius)}
                      />
                    </defs>
                    <textPath href={`#lui-radial-label-${labelId}-${entry.index}`}>
                      {entry.datum.value}
                    </textPath>
                  </text>
                </Show>
              </g>
            )}
          </For>
        </g>
      </svg>
      <Show when={props.legend}>
        <RadialBarLegend data={props.data} />
      </Show>
      <Show when={props.tooltip !== false && activeEntry()}>
        {(entry) => (
          <ChartTooltipCard
            label={entry().datum.name}
            items={[{ name: 'value', value: entry().datum.value, color: entry().datum.color }]}
            pointer={displayedChartPoint(
              { x: width() / 2, y: width() / 2 + verticalOffset() - entry().radius },
              width(),
              height(),
              displaySize(),
            )}
            chartWidth={displaySize().width}
            chartHeight={displaySize().height}
          />
        )}
      </Show>
    </div>
  );
}
