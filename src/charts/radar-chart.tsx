import { splitProps } from '../primitives/utils/split-props';
import { For, Show, createMemo, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { RadarGrid } from './radar-grid';
import { RadarLegend } from './radar-legend';
import { radarMaximum, radarSeriesPoints, type RadarPoint } from './radar-geometry';
import { RadarSeriesShape } from './radar-series';
import { RadarTooltip } from './radar-tooltip';
import type { RadarChartProps } from './radar-chart-types';
import { RadarScatterFrame } from './radar-scatter-frame';
import { radarChartKeys } from './radar-scatter-native';
import { displayedChartPoint, useChartDisplaySize } from './chart-display-size';

export type { RadarDatum } from './radar-geometry';
export type { RadarSeries, RadarChartProps } from './radar-chart-types';

/** Draw a standalone, theme-aware polar radar chart for SolidJS. */
export function RadarChart(props: RadarChartProps): JSX.Element {
  const [, native] = splitProps(props, radarChartKeys);
  let chartSvg: SVGSVGElement | undefined;
  const [activeIndex, setActiveIndex] = createSignal<number | null>(null);
  const [pointer, setPointer] = createSignal<RadarPoint>({ x: 192, y: 56 });
  /** Use a compact 384 by 288 chart container. */
  const width = () => props.width ?? 384;
  /** Keep the polar center vertically balanced in the default aspect ratio. */
  const height = () => props.height ?? 288;
  const displaySize = useChartDisplaySize(
    /** Read the mounted SVG after Solid has attached its ref. */
    () => chartSvg,
    width,
    height,
  );
  /** Bound the plot by the available half-height and default outer radius. */
  const radius = () =>
    Math.max(0, Math.min(width() / 2, height() / 2) * (props.legend ? 0.6944 : 0.7722));
  /** Derive a shared, readable value domain for all visible series. */
  const maximum = createMemo(
    /** Recompute the domain when data or series selection changes. */
    () =>
      props.maxValue !== undefined && Number.isFinite(props.maxValue) && props.maxValue > 0
        ? props.maxValue
        : radarMaximum(
            props.data,
            props.series.map(
              /** Include only values represented by a visible radar polygon. */
              (series) => series.name,
            ),
          ),
  );
  /** Expose keyboard navigation only for stories with an actual tooltip. */
  const interactive = () => props.tooltip === true && props.data.length > 0;
  /** Locate a data vertex for tooltip placement during keyboard navigation. */
  function pointAt(index: number): RadarPoint {
    const name = props.series[0]?.name;
    return (
      (name &&
        radarSeriesPoints(props.data, name, width() / 2, height() / 2, radius(), maximum())[
          index
        ]) || { x: width() / 2, y: height() / 2 }
    );
  }
  /** Activate the first category when the chart receives keyboard focus. */
  function focus(): void {
    if (!interactive()) return;
    setPointer(pointAt(0));
    setActiveIndex(0);
  }
  /** Clear the current category when focus or the pointer leaves. */
  function clear(): void {
    setActiveIndex(null);
  }
  /** Step between categories with arrow keys and dismiss with Escape. */
  function keyDown(event: KeyboardEvent): void {
    if (!interactive()) return;
    if (event.key === 'Escape') return clear();
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const index = Math.max(0, Math.min(props.data.length - 1, (activeIndex() ?? 0) + step));
    setPointer(pointAt(index));
    setActiveIndex(index);
  }
  /** Select one data category from a hovered point. */
  function enter(index: number): void {
    if (props.tooltip) setActiveIndex(index);
  }
  /** Select the nearest category axis as the pointer crosses the polar plot. */
  function pointerMove(event: PointerEvent): void {
    if (!interactive() || !(event.currentTarget instanceof SVGSVGElement)) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;
    const pointerX = ((event.clientX - bounds.left) * width()) / bounds.width;
    const pointerY = ((event.clientY - bounds.top) * height()) / bounds.height;
    setPointer({ x: pointerX, y: pointerY });
    const x = pointerX - width() / 2;
    const y = pointerY - height() / 2;
    const angle = (Math.atan2(x, -y) + Math.PI * 2) % (Math.PI * 2);
    setActiveIndex(Math.round((angle * props.data.length) / (Math.PI * 2)) % props.data.length);
  }

  return (
    <RadarScatterFrame
      kind="radar"
      native={native}
      dimension={width()}
      interactive={interactive()}
      keyboardLabel="Radar chart; use arrow keys to inspect categories"
      ref={props.ref}
      onFocus={focus}
      onBlur={clear}
      onKeyDown={keyDown}
    >
      <svg
        ref={chartSvg}
        class="leverui-radar-chart__svg"
        role="img"
        aria-label={props['aria-label'] ?? 'Radar chart'}
        viewBox={`0 0 ${width()} ${height()}`}
        width={width()}
        height={height()}
        onPointerMove={pointerMove}
        onPointerLeave={clear}
      >
        <RadarGrid
          data={props.data}
          centerX={width() / 2}
          centerY={height() / 2}
          radius={radius()}
          maximum={maximum()}
          grid={props.grid ?? 'polygon'}
          angleLabels={props.angleLabels !== false}
          radiusLabels={props.radiusLabels === true}
        />
        <For each={props.series}>
          {/** Plot each independent series over the shared value grid. */}
          {(series) => (
            <RadarSeriesShape
              data={props.data}
              series={series}
              centerX={width() / 2}
              centerY={height() / 2}
              radius={radius()}
              maximum={maximum()}
              linesOnly={props.linesOnly === true}
              strokeWidth={props.linesOnly || props.series.length > 1 ? 2 : 1}
              dots={props.dots === true}
              pointLabels={props.pointLabels === true}
              onPointEnter={enter}
              onPointLeave={clear}
            />
          )}
        </For>
      </svg>
      <Show when={props.legend}>
        <RadarLegend series={props.series} />
      </Show>
      <Show when={props.tooltip && activeIndex() !== null}>
        <Show when={props.data[activeIndex() ?? -1]}>
          {/** Render the active data row only while it still exists. */}
          {(datum) => (
            <RadarTooltip
              datum={datum()}
              series={props.series}
              pointer={displayedChartPoint(pointer(), width(), height(), displaySize())}
              chartWidth={displaySize().width}
              chartHeight={displaySize().height}
            />
          )}
        </Show>
      </Show>
    </RadarScatterFrame>
  );
}
