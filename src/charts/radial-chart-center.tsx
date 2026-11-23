import { type JSX } from '@solidjs/web';

/** Text and center point for a donut's title and supporting unit. */
export interface RadialChartCenterProps {
  center: number;
  title: string;
  description?: string | undefined;
}

/** Stack the total and its unit in the center of a donut ring. */
export function RadialChartCenter(props: RadialChartCenterProps): JSX.Element {
  return (
    <text
      class="lui-radial-chart__center"
      x={props.center}
      y={props.center}
      text-anchor="middle"
      dominant-baseline="middle"
    >
      <tspan class="lui-radial-chart__centerTitle" x={props.center} y={props.center}>
        {props.title}
      </tspan>
      <tspan class="lui-radial-chart__centerDescription" x={props.center} y={props.center + 24}>
        {props.description}
      </tspan>
    </text>
  );
}
