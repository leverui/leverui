import { type JSX } from '@solidjs/web';
import { Box, Circle, Float } from '../../src';

/** Render the shared 80px positioning surface and red count marker. */
function FloatSurface(props: { offset?: string; offsetX?: string; offsetY?: string }): JSX.Element {
  return (
    <Box class="float-example-surface">
      <Float offset={props.offset} offsetX={props.offsetX} offsetY={props.offsetY}>
        <Circle size="5" class="float-example-count" aria-hidden="true">
          3
        </Circle>
      </Float>
    </Box>
  );
}

/** Show Float at its default top-end position. */
export function FloatBasic(): JSX.Element {
  return <FloatSurface />;
}

/** Move Float along the horizontal axis. */
export function FloatWithOffsetX(): JSX.Element {
  return <FloatSurface offsetX="-4" />;
}

/** Move Float along the vertical axis. */
export function FloatWithOffsetY(): JSX.Element {
  return <FloatSurface offsetY="-4" />;
}

/** Move Float along both axes with a shared offset. */
export function FloatWithOffset(): JSX.Element {
  return <FloatSurface offset="4" />;
}
