import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderProgressCirclePart, type CircleRuntimePartProps } from './progress-circle-part';
import type {
  ProgressCircleCircleProps,
  ProgressCircleLabelProps,
  ProgressCircleRangeProps,
  ProgressCircleTrackProps,
  ProgressCircleValueTextProps,
} from './progress-circle-props';

/** Render the visible Circle label for explicit SVG association. */
function ProgressCircleLabelImpl(props: CircleRuntimePartProps): JSX.Element {
  return renderProgressCirclePart('label', props);
}

/** Render the accessible SVG progressbar. */
function ProgressCircleCircleImpl(props: CircleRuntimePartProps): JSX.Element {
  return renderProgressCirclePart('circle', props);
}

/** Render the SVG track behind the completion arc. */
function ProgressCircleTrackImpl(props: CircleRuntimePartProps): JSX.Element {
  return renderProgressCirclePart('circleTrack', props);
}

/** Render the machine-driven SVG completion arc. */
function ProgressCircleRangeImpl(props: CircleRuntimePartProps): JSX.Element {
  return renderProgressCirclePart('circleRange', props);
}

/** Render the machine's formatted progress value by default. */
function ProgressCircleValueTextImpl(props: CircleRuntimePartProps): JSX.Element {
  return renderProgressCirclePart('valueText', props);
}

/** Type the label against its selected native element. */
export const ProgressCircleLabel = ProgressCircleLabelImpl as <
  As extends PrimitiveNativeTag = 'span',
>(
  props: ProgressCircleLabelProps<As>,
) => JSX.Element;

/** Type the SVG progressbar against its selected native element. */
export const ProgressCircleCircle = ProgressCircleCircleImpl as <
  As extends PrimitiveNativeTag = 'svg',
>(
  props: ProgressCircleCircleProps<As>,
) => JSX.Element;

/** Type the track against its selected native element. */
export const ProgressCircleTrack = ProgressCircleTrackImpl as <
  As extends PrimitiveNativeTag = 'circle',
>(
  props: ProgressCircleTrackProps<As>,
) => JSX.Element;

/** Type the range against its selected native element. */
export const ProgressCircleRange = ProgressCircleRangeImpl as <
  As extends PrimitiveNativeTag = 'circle',
>(
  props: ProgressCircleRangeProps<As>,
) => JSX.Element;

/** Type the value text against its selected native element. */
export const ProgressCircleValueText = ProgressCircleValueTextImpl as <
  As extends PrimitiveNativeTag = 'span',
>(
  props: ProgressCircleValueTextProps<As>,
) => JSX.Element;
