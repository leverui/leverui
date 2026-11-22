import { For, Show, createMemo, createUniqueId } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  chartAreaPath,
  chartRenderableSegments,
  chartSeriesPoints,
  chartLinePath,
} from './cartesian-geometry';
import { chartColor } from './chart-color';
import { CartesianGradient } from './cartesian-gradient';
import type { CartesianChartProps, CartesianPlot } from './cartesian-types';

/** Inputs used to draw all series on one Cartesian plot. */
export interface CartesianSeriesLayerProps {
  data: CartesianChartProps['data'];
  series: CartesianChartProps['series'];
  plot: CartesianPlot;
  rightPlot?: CartesianPlot | undefined;
  kind: 'area' | 'line';
  stacked: boolean;
  percent: boolean;
  fillOpacity: number;
  gradient: boolean;
  valueGradient: boolean;
  curve: NonNullable<CartesianChartProps['curve']>;
  dots: boolean;
  pointLabels: boolean;
  pointLabelPosition: 'top' | 'right';
  connectNulls: boolean;
  activeIndex: number | null;
  highlightedSeries: string | null;
}

/** Draw lines, filled areas, dots, and value labels for all series. */
export function CartesianSeriesLayer(props: CartesianSeriesLayerProps): JSX.Element {
  const id = createUniqueId();
  return (
    <g class="leverui-cartesian-chart__seriesLayer">
      <For each={props.series}>
        {/** Render one series using its theme color and numeric samples. */}
        {(series, seriesIndex) => {
          const points = createMemo(
            /** Scale current values against the shared plot. */
            () =>
              chartSeriesPoints(
                props.data,
                props.series,
                seriesIndex(),
                series.yAxis === 'right' && props.rightPlot ? props.rightPlot : props.plot,
                props.stacked,
                props.percent,
              ),
          );
          const segments = createMemo(
            /** Preserve gaps unless the consumer asks to connect missing samples. */
            () => chartRenderableSegments(points(), props.kind, props.stacked, props.connectNulls),
          );
          /** Resolve one source token through the current CSS theme. */
          const color = () => chartColor(series.color, series.color);
          /** Keep gradient IDs stable across reactive rerenders. */
          const gradientId = () => `${id}-${seriesIndex()}`;
          /** Keep multicolor line stroke separate from an area fill gradient. */
          const strokeGradientId = () => `${gradientId()}-stroke`;
          /** Choose a solid fill or a chart gradient. */
          const fill = () =>
            props.gradient || props.valueGradient ? `url(#${gradientId()})` : color();
          return (
            <g
              class="leverui-cartesian-chart__series"
              data-series={series.name}
              data-muted={
                props.highlightedSeries && props.highlightedSeries !== series.name ? '' : undefined
              }
            >
              <Show when={props.gradient || props.valueGradient}>
                <CartesianGradient
                  id={gradientId()}
                  color={color()}
                  plot={props.plot}
                  valueGradient={props.valueGradient}
                />
              </Show>
              <Show when={series.strokeGradientStops?.length}>
                <defs>
                  <linearGradient id={strokeGradientId()} x1="0" x2="0" y1="0" y2="1">
                    <For each={series.strokeGradientStops}>
                      {/** Resolve one named theme color in the line gradient. */}
                      {(stop) => (
                        <stop
                          offset={stop.offset}
                          stop-color={chartColor(stop.color, stop.color)}
                        />
                      )}
                    </For>
                  </linearGradient>
                </defs>
              </Show>
              <For each={segments()}>
                {/** Trace each uninterrupted run of series values. */}
                {(segment) => (
                  <>
                    <Show when={props.kind === 'area'}>
                      <path
                        class="leverui-cartesian-chart__area"
                        d={chartAreaPath(segment, props.curve)}
                        fill={fill()}
                        fill-opacity={props.gradient ? 1 : props.fillOpacity}
                      />
                    </Show>
                    <path
                      class="leverui-cartesian-chart__line"
                      d={chartLinePath(segment, props.curve)}
                      stroke={
                        series.strokeGradientStops?.length
                          ? `url(#${strokeGradientId()})`
                          : chartColor(series.stroke, color())
                      }
                      stroke-width={series.strokeWidth ?? 1}
                      stroke-dasharray={series.strokeDasharray}
                    />
                  </>
                )}
              </For>
              <Show when={props.dots || props.pointLabels}>
                <For
                  each={points().filter(
                    /** Omit missing values from point markers. */
                    (point) => point.value !== null,
                  )}
                >
                  {/** Mark and optionally label each numeric point. */}
                  {(point) => (
                    <>
                      <circle
                        class="leverui-cartesian-chart__dot"
                        cx={point.x}
                        cy={point.y}
                        r={
                          point.index === props.activeIndex
                            ? (series.activeDotRadius ?? series.dotRadius ?? 3)
                            : (series.dotRadius ?? 3)
                        }
                        fill={chartColor(series.dotFill, color())}
                        stroke={chartColor(
                          point.index === props.activeIndex
                            ? series.activeDotStroke
                            : series.dotStroke,
                          'var(--leverui-colors-bg)',
                        )}
                        stroke-width={series.dotStrokeWidth ?? 1}
                      />
                      <Show when={props.pointLabels}>
                        <text
                          class="leverui-cartesian-chart__pointLabel"
                          data-position={props.pointLabelPosition}
                          x={point.x + (props.pointLabelPosition === 'right' ? 10 : 0)}
                          y={point.y - (props.pointLabelPosition === 'right' ? 0 : 4)}
                        >
                          {point.value}
                        </text>
                      </Show>
                    </>
                  )}
                </For>
              </Show>
            </g>
          );
        }}
      </For>
    </g>
  );
}
