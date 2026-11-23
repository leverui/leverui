import { createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Point coordinates needed to position the reference guides. */
export interface SparklineReferencePoint {
  y: number;
}

/** Values and plot geometry used by a sparkline reference guide. */
export interface SparklineReferenceProps {
  points: readonly SparklineReferencePoint[];
  values: readonly number[];
  width: number;
  inset: number;
}

/** Draw horizontal guides at the plotted minimum and maximum values. */
export function SparklineReferenceLines(props: SparklineReferenceProps): JSX.Element {
  const bounds = createMemo(
    /** Track the upper and lower sample positions. */
    () => {
      const positions = props.points.map(
        /** Read the vertical coordinate of one sample. */
        (point) => point.y,
      );
      return { top: Math.min(...positions), bottom: Math.max(...positions) };
    },
  );

  return (
    <>
      <line
        class="lui-sparkline__reference-line"
        x1={props.inset}
        x2={props.width - props.inset}
        y1={bounds().bottom}
        y2={bounds().bottom}
      />
      <line
        class="lui-sparkline__reference-line"
        x1={props.inset}
        x2={props.width - props.inset}
        y1={bounds().top}
        y2={bounds().top}
      />
      <text
        class="lui-sparkline__reference-label"
        x="0"
        y={bounds().bottom + 4.5}
        text-anchor="end"
      >
        {Math.min(...props.values)}
      </text>
      <text
        class="lui-sparkline__reference-label"
        x={props.width}
        y={bounds().top + 4.5}
        text-anchor="start"
      >
        {Math.max(...props.values)}
      </text>
    </>
  );
}
