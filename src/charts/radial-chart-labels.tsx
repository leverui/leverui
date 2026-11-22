import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { radialPoint, type RadialSector } from './radial-geometry';
import type { RadialLabel } from './radial-chart-types';

/** Inputs for labels attached to each chart sector. */
export interface RadialChartLabelsProps {
  sectors: readonly RadialSector[];
  center: number;
  innerRadius: number;
  outerRadius: number;
  placement: RadialLabel;
  formatter?: (sector: RadialSector) => string;
}

/** Render percentage or name labels at the requested radial positions. */
export function RadialChartLabels(props: RadialChartLabelsProps): JSX.Element {
  return (
    <g class="leverui-radial-chart__labels" data-placement={props.placement} aria-hidden="true">
      <For each={props.sectors}>
        {/** Position a label relative to its sector midpoint. */}
        {(sector) => {
          /** Decide whether the label sits beyond the sector edge. */
          const outside = () => props.placement !== 'inside';
          /** Measure the label's distance from the chart center. */
          const radius = () =>
            outside() ? props.outerRadius + 20 : (props.innerRadius + props.outerRadius) / 2;
          /** Locate the label along the sector's angle bisector. */
          const point = () => radialPoint(props.center, radius(), sector.midAngle);
          /** Align outer labels away from the chart. */
          const anchor = () =>
            outside() && point().x < props.center - 4
              ? 'end'
              : outside() && point().x > props.center + 4
                ? 'start'
                : 'middle';
          return (
            <>
              <line
                class="leverui-radial-chart__labelLine"
                x1={radialPoint(props.center, props.outerRadius, sector.midAngle).x}
                y1={radialPoint(props.center, props.outerRadius, sector.midAngle).y}
                x2={radialPoint(props.center, props.outerRadius + 20, sector.midAngle).x}
                y2={radialPoint(props.center, props.outerRadius + 20, sector.midAngle).y}
              />
              <text
                class="leverui-radial-chart__label"
                x={point().x}
                y={point().y}
                dominant-baseline={outside() ? undefined : 'middle'}
                dy={outside() ? undefined : 1.3}
                text-anchor={anchor()}
              >
                {props.formatter?.(sector) ?? sector.datum.name}
              </text>
            </>
          );
        }}
      </For>
    </g>
  );
}
