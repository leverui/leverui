import { For, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { barPath, barRange, barRect, type BarRect } from './bar-geometry';
import { chartColor } from './chart-color';
import { chartY } from './cartesian-geometry';
import type { CartesianPlot } from './cartesian-types';
import type { BarChartProps } from './bar-chart-types';

/** Render the bars for all category and series combinations. */
export function BarMarks(props: {
  chart: BarChartProps;
  plot: CartesianPlot;
  onBarEnter: (rect: BarRect) => void;
  onBarLeave: () => void;
}): JSX.Element {
  const bars = createMemo(
    /** Recalculate bar slots, stacked baselines, and heights from source data. */
    () =>
      props.chart.data.flatMap(
        /** Place every visible series inside this category band. */
        (_, rowIndex) =>
          props.chart.series.flatMap(
            /** Omit series with no row or zero visible height. */
            (_, seriesIndex) => {
              const rect = barRect(props.chart, props.plot, rowIndex, seriesIndex);
              return rect && rect.height > 0 ? [rect] : [];
            },
          ),
      ),
  );
  /** Use a row-specific color only for a series that opts into it. */
  function fill(rect: BarRect): string {
    const rowColor = rect.series.colorKey ? rect.row[rect.series.colorKey] : undefined;
    const signColor = rect.series.colorBySign?.[rect.value < 0 ? 'negative' : 'positive'];
    const interval = rect.row[rect.series.name];
    const directionColor =
      Array.isArray(interval) && rect.series.colorByDirection
        ? rect.series.colorByDirection[interval[0] > interval[1] ? 'down' : 'up']
        : undefined;
    return chartColor(
      typeof rowColor === 'string' ? rowColor : (directionColor ?? signColor ?? rect.series.color),
      rect.series.color,
    );
  }

  return (
    <g class="leverui-bar-chart__marks" data-bar-marks="">
      <For each={bars()}>
        {/** Draw a single labeled bar with optional rounded upper corners. */}
        {(rect) => {
          /** Use the series' label options only when it provides an object. */
          const label = () =>
            typeof rect.series.label === 'object' ? rect.series.label : undefined;
          /** Activate the category tooltip when this bar is hovered. */
          function enter(): void {
            props.onBarEnter(rect);
          }
          return (
            <g class="leverui-bar-chart__mark">
              {rect.series.wickKey && <BarWick rect={rect} plot={props.plot} />}
              <path
                class="leverui-bar-chart__bar"
                data-bar-series={rect.series.name}
                data-bar-category={String(rect.row[props.chart.xKey] ?? '')}
                d={barPath(rect, rect.series.radius ?? 0)}
                fill={fill(rect)}
                stroke={rect.series.stroke}
                fill-opacity={rect.series.fillOpacity}
                onPointerEnter={enter}
                onPointerLeave={props.onBarLeave}
              />
              {rect.series.label && (
                <text
                  class="leverui-bar-chart__bar-label"
                  x={rect.x + rect.width / 2}
                  y={
                    rect.value < 0
                      ? rect.y + rect.height + (label()?.negativeOffset ?? 19)
                      : rect.y - (label()?.positiveOffset ?? 5)
                  }
                  text-anchor="middle"
                  style={{
                    'font-weight': label()?.weight ? `${label()?.weight}` : undefined,
                    fill: label()?.color ? chartColor(label()?.color, '') : undefined,
                  }}
                >
                  {rect.value}
                </text>
              )}
            </g>
          );
        }}
      </For>
    </g>
  );
}

/** Draw the high-to-low stem behind one candlestick body. */
function BarWick(props: { rect: BarRect; plot: CartesianPlot }): JSX.Element {
  /** Read the high and low, or collapse the stem when the row has no wick pair. */
  function endpoints(): readonly [number, number] {
    const wick = barRange(props.rect.row[props.rect.series.wickKey ?? '']);
    return wick ?? [props.rect.value, props.rect.value];
  }
  /** Place one wick endpoint on the numeric plot scale. */
  const point = (index: 0 | 1) => chartY(props.plot, endpoints()[index]);
  /** Center the error stem on its candlestick body. */
  const center = () => props.rect.x + props.rect.width / 2;
  return (
    <g class="leverui-bar-chart__wick" data-bar-wick="">
      <line x1={center()} x2={center()} y1={point(0)} y2={point(1)} />
      <line x1={center() - 2} x2={center() + 2} y1={point(0)} y2={point(0)} />
      <line x1={center() - 2} x2={center() + 2} y1={point(1)} y2={point(1)} />
    </g>
  );
}
