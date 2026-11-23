import { splitProps } from '../primitives/utils/split-props';
import { For, Show, createMemo, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ScatterAxes } from './scatter-axes';
import {
  scatterMaximum,
  scatterTrend,
  scatterX,
  scatterXDomain,
  scatterY,
  type ScatterPlot,
} from './scatter-geometry';
import { scatterEntries, ScatterMarks, type ScatterEntry } from './scatter-marks';
import { ScatterLegend } from './scatter-legend';
import { ScatterTooltip } from './scatter-tooltip';
import type { ScatterChartProps } from './scatter-chart-types';
import { useCartesianWidth } from './cartesian-width';
import { RadarScatterFrame } from './radar-scatter-frame';
import { scatterChartKeys } from './radar-scatter-native';

export type { ScatterDatum } from './scatter-geometry';
export type { ScatterChartProps, ScatterSeries } from './scatter-chart-types';

/** Plot numeric x/y samples with independent axes and optional grouped series. */
export function ScatterChart(props: ScatterChartProps): JSX.Element {
  const [, native] = splitProps(props, scatterChartKeys);
  let container: HTMLDivElement | undefined;
  const width = useCartesianWidth(
    /** Supply the mounted chart container to the resize observer. */
    () => container,
  );
  const [activeIndex, setActiveIndex] = createSignal<number | null>(null);
  /** Retain valid source samples for each selected color group. */
  const groups = createMemo(
    /** Refilter rows when data, grouping, or coordinate keys change. */
    () =>
      props.series.map(
        /** Resolve one group's plotted measurements. */
        (series) => scatterEntries(props.data, series, props.xKey, props.yKey),
      ),
  );
  /** Flatten displayed groups for keyboard navigation and tooltip lookup. */
  const entries = createMemo(
    /** Keep the same order as the visible color groups. */
    () => groups().flat(),
  );
  /** Use supplied domains or derive both axes from valid source values. */
  const plot = createMemo(
    /** Recalculate geometry as the container or data changes. */
    (): ScatterPlot => {
      const [xMin, xMax] = props.xDomain ?? scatterXDomain(props.data, props.xKey);
      const [yMin, yMax] = props.yDomain ?? [0, scatterMaximum(props.data, props.yKey)];
      if (![xMin, xMax, yMin, yMax].every(Number.isFinite) || xMin >= xMax || yMin >= yMax) {
        throw new Error('Scatter chart domains must contain finite increasing bounds.');
      }
      const height = props.height ?? 384;
      const top = props.topInset ?? 5;
      const bottom = props.showLegend ? 64 : 35;
      const left = props.leftInset ?? 65;
      const right = props.rightInset ?? 6;
      if (!Number.isFinite(height) || !Number.isFinite(top) || top < 0 || height <= top + bottom) {
        throw new Error('Scatter chart height must leave room for both axes and data points.');
      }
      if (
        ![left, right].every(Number.isFinite) ||
        left < 0 ||
        right < 0 ||
        left + right >= width()
      ) {
        throw new Error('Scatter chart insets must leave room for data points.');
      }
      return {
        width: width(),
        height,
        left,
        right,
        top,
        bottom,
        xMin,
        xMax,
        yMin,
        yMax,
      };
    },
  );
  /** Read the active measurement if it still exists in the rendered groups. */
  const activeEntry = () => entries()[activeIndex() ?? -1];
  /** Fit a least-squares line to the visible data. */
  const trend = createMemo(
    /** Refit when a numeric coordinate or source row changes. */
    () => (props.trendLine ? scatterTrend(props.data, props.xKey, props.yKey) : null),
  );
  /** Start keyboard inspection at the first displayed point. */
  function focus(): void {
    if (props.tooltip && entries().length) setActiveIndex(0);
  }
  /** Hide the point tooltip after focus or pointer leaves the chart. */
  function clear(): void {
    setActiveIndex(null);
  }
  /** Step through every displayed point in source order. */
  function keyDown(event: KeyboardEvent): void {
    if (!props.tooltip || entries().length === 0) return;
    if (event.key === 'Escape') return clear();
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const step = event.key === 'ArrowRight' ? 1 : -1;
    setActiveIndex(Math.max(0, Math.min(entries().length - 1, (activeIndex() ?? 0) + step)));
  }
  /** Reveal the hovered point in the optional tooltip. */
  function enter(entry: ScatterEntry): void {
    if (props.tooltip) setActiveIndex(entries().indexOf(entry));
  }
  /** Capture the root before the responsive width observer connects. */
  function attachContainer(element: HTMLDivElement): void {
    container = element;
  }

  return (
    <RadarScatterFrame
      kind="scatter"
      native={native}
      dimension={plot().height}
      interactive={props.tooltip === true && entries().length > 0}
      keyboardLabel="Scatter chart; use arrow keys to inspect points"
      ref={props.ref}
      onMeasure={attachContainer}
      onFocus={focus}
      onBlur={clear}
      onKeyDown={keyDown}
    >
      <svg
        class="lui-scatter-chart__svg"
        role="img"
        aria-label={props['aria-label'] ?? 'Scatter chart'}
        viewBox={`0 0 ${plot().width} ${plot().height}`}
        width={plot().width}
        height={plot().height}
      >
        <ScatterAxes plot={plot()} xTicks={props.xTicks} xFormatter={props.xFormatter} />
        <Show when={props.tooltip && activeEntry()}>
          <g class="lui-scatter-chart__cursor" data-scatter-cursor="">
            <line
              x1={scatterX(plot(), activeEntry()?.x ?? 0)}
              x2={scatterX(plot(), activeEntry()?.x ?? 0)}
              y1={plot().top}
              y2={plot().height - plot().bottom}
            />
            <line
              x1={plot().left}
              x2={plot().width - plot().right}
              y1={scatterY(plot(), activeEntry()?.y ?? 0)}
              y2={scatterY(plot(), activeEntry()?.y ?? 0)}
            />
          </g>
        </Show>
        <Show when={trend()}>
          {/** Connect the two fitted endpoints without rendering extra data dots. */}
          {(ends) => (
            <line
              data-scatter-trend=""
              class="lui-scatter-chart__trend"
              x1={scatterX(plot(), ends()[0].x)}
              x2={scatterX(plot(), ends()[1].x)}
              y1={scatterY(plot(), ends()[0].y)}
              y2={scatterY(plot(), ends()[1].y)}
            />
          )}
        </Show>
        <For each={groups()}>
          {/** Draw each group's dots and optional source-ordered line. */}
          {(group) => (
            <ScatterMarks
              entries={group}
              plot={plot()}
              connectDots={props.connectDots === true}
              onPointEnter={enter}
              onPointLeave={clear}
            />
          )}
        </For>
      </svg>
      <Show when={props.showLegend}>
        <ScatterLegend series={props.series} />
      </Show>
      <Show when={props.tooltip && activeEntry()}>
        {/** Render a tooltip only for a currently displayed measurement. */}
        {(entry) => <ScatterTooltip entry={entry()} plot={plot()} />}
      </Show>
    </RadarScatterFrame>
  );
}
