import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { radarPath, radarPoint } from './radar-geometry';
import type { RadarChartProps } from './radar-chart-types';

/** The polar grid and category labels share a single geometry contract. */
export interface RadarGridProps {
  data: RadarChartProps['data'];
  centerX: number;
  centerY: number;
  radius: number;
  maximum: number;
  grid: NonNullable<RadarChartProps['grid']>;
  angleLabels: boolean;
  radiusLabels: boolean;
}

/** Draw concentric levels, category spokes, and optional polar ticks. */
export function RadarGrid(props: RadarGridProps): JSX.Element {
  /** Locate a category's label just outside the outer grid ring. */
  function labelPoint(index: number): { x: number; y: number } {
    return radarPoint(props.centerX, props.centerY, props.radius + 8, index, props.data.length);
  }
  /** Align side labels away from the circle while centering top and bottom labels. */
  function labelAnchor(x: number): 'start' | 'middle' | 'end' {
    if (x < props.centerX - 8) return 'end';
    if (x > props.centerX + 8) return 'start';
    return 'middle';
  }
  /** Align labels to top, middle, and bottom text baselines. */
  function labelBaseline(y: number): string {
    if (y < props.centerY - props.radius / 2) return '0em';
    if (y > props.centerY + props.radius / 2) return '0.71em';
    return '0.355em';
  }

  return (
    <g class="lui-radar-chart__grid" data-radar-grid="" data-grid={props.grid}>
      <For each={[1, 2, 3, 4]}>
        {/** Draw each value level with the selected grid shape. */}
        {(level) => {
          /** Scale this ring from one quarter to the full domain. */
          const ringRadius = () => (props.radius * level) / 4;
          /** Join the category spokes at this value level. */
          const ringPath = () =>
            radarPath(
              props.data.map(
                /** Place one grid vertex on each category axis. */
                (_, index) =>
                  radarPoint(props.centerX, props.centerY, ringRadius(), index, props.data.length),
              ),
            );
          return (
            <Show
              when={props.grid === 'circle'}
              fallback={<path class="lui-radar-chart__ring" d={ringPath()} />}
            >
              <circle
                class="lui-radar-chart__ring"
                cx={props.centerX}
                cy={props.centerY}
                r={ringRadius()}
              />
            </Show>
          );
        }}
      </For>
      <For each={props.data}>
        {/** Add one spoke and optional name for every category. */}
        {(datum, index) => {
          /** Locate the outer end of this category's spoke. */
          const end = () =>
            radarPoint(props.centerX, props.centerY, props.radius, index(), props.data.length);
          return (
            <>
              <Show when={props.grid !== 'filled'}>
                <line
                  class="lui-radar-chart__spoke"
                  x1={props.centerX}
                  y1={props.centerY}
                  x2={end().x}
                  y2={end().y}
                />
              </Show>
              <Show when={props.angleLabels}>
                <text
                  class="lui-radar-chart__angle-label"
                  x={labelPoint(index()).x}
                  y={labelPoint(index()).y}
                  text-anchor={labelAnchor(labelPoint(index()).x)}
                >
                  <tspan x={labelPoint(index()).x} dy={labelBaseline(labelPoint(index()).y)}>
                    {datum.label}
                  </tspan>
                </text>
              </Show>
            </>
          );
        }}
      </For>
      <Show when={props.radiusLabels}>
        <For each={[0, 1, 2, 3, 4]}>
          {/** Mark the same four intervals used by the grid rings. */}
          {(level) => (
            <text
              class="lui-radar-chart__radius-label"
              x={props.centerX + (props.radius * level) / 4}
              y={props.centerY}
              transform={`rotate(90 ${props.centerX + (props.radius * level) / 4} ${props.centerY})`}
              text-anchor="start"
            >
              <tspan x={props.centerX + (props.radius * level) / 4} dy="0em">
                {(props.maximum * level) / 4}
              </tspan>
            </text>
          )}
        </For>
      </Show>
    </g>
  );
}
