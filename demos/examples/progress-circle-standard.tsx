import { type JSX } from '@solidjs/web';
import { ProgressCircle } from '../../src';

/** Show a 75-percent circular progress indicator. */
export function ProgressCircleBasic(): JSX.Element {
  return (
    <ProgressCircle.Root value={75}>
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
}

/** Render an indeterminate small circle with its loading state. */
export function ProgressCircleIndeterminate(): JSX.Element {
  return (
    <ProgressCircle.Root value={null} size="sm">
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
}

/** Override the completion arc with the orange stroke. */
export function ProgressCircleWithRangeColor(): JSX.Element {
  return (
    <ProgressCircle.Root value={75}>
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range stroke="orange" />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
}

/** Give the completion arc rounded endpoints. */
export function ProgressCircleWithRoundCap(): JSX.Element {
  return (
    <ProgressCircle.Root value={75}>
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range strokeLinecap="round" />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
}

/** Narrow the circle's public thickness token to two pixels. */
export function ProgressCircleWithThickness(): JSX.Element {
  return (
    <ProgressCircle.Root value={75}>
      <ProgressCircle.Circle style={{ '--leverui-progress-circle-thickness': '2px' }}>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
}
