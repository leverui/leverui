import { For, Show, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import { radarPath, radarSeriesPoints } from './radar-geometry';
import type { RadarChartProps, RadarSeries as RadarSeriesModel } from './radar-chart-types';

/** Draw one measurement polygon and its optional point decorations. */
export interface RadarSeriesProps {
  data: RadarChartProps['data'];
  series: RadarSeriesModel;
  centerX: number;
  centerY: number;
  radius: number;
  maximum: number;
  linesOnly: boolean;
  strokeWidth: number;
  dots: boolean;
  pointLabels: boolean;
  onPointEnter: (index: number) => void;
  onPointLeave: () => void;
}

/** Render one colored radar shape from the shared polar coordinates. */
export function RadarSeriesShape(props: RadarSeriesProps): JSX.Element {
  const points = createMemo(
    /** Recalculate the polygon when the series or chart domain changes. */
    () =>
      radarSeriesPoints(
        props.data,
        props.series.name,
        props.centerX,
        props.centerY,
        props.radius,
        props.maximum,
      ),
  );
  /** Resolve the current theme color for stroke, fill, and dots. */
  const color = () => chartColor(props.series.color, props.series.color);

  return (
    <g class="leverui-radar-chart__series" data-radar-series={props.series.name}>
      <path
        class="leverui-radar-chart__shape"
        d={radarPath(points())}
        stroke={color()}
        fill={props.linesOnly ? 'none' : color()}
        data-stroke-width={props.strokeWidth}
      />
      <For each={points()}>
        {/** Attach the data-point hit target and optional visible marker. */}
        {(point, index) => {
          /** Read this category's value without treating labels as measurements. */
          const value = () => props.data[index()]?.[props.series.name];
          /** Activate the tooltip when this vertex is hovered. */
          function enter(): void {
            props.onPointEnter(index());
          }
          return (
            <g class="leverui-radar-chart__point" data-radar-point={index()}>
              <circle
                class="leverui-radar-chart__point-dot"
                cx={point.x}
                cy={point.y}
                r={props.dots ? 3 : 9}
                fill={props.dots ? color() : 'transparent'}
                stroke={props.dots ? color() : 'none'}
                onPointerEnter={enter}
                onPointerLeave={props.onPointLeave}
              />
              <Show when={props.pointLabels && typeof value() === 'number'}>
                <text
                  class="leverui-radar-chart__point-label"
                  x={point.x}
                  y={point.y}
                  text-anchor="middle"
                >
                  <tspan x={point.x} dy="0.355em">
                    {value()}
                  </tspan>
                </text>
              </Show>
            </g>
          );
        }}
      </For>
    </g>
  );
}
