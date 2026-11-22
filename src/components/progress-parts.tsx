import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderProgressPart, type ProgressRuntimePartProps } from './progress-part';
import type {
  ProgressLabelProps,
  ProgressRangeProps,
  ProgressTrackProps,
  ProgressValueTextProps,
} from './progress-props';

/** Render the visible Progress label for explicit track association. */
function ProgressLabelImpl(props: ProgressRuntimePartProps): JSX.Element {
  return renderProgressPart('label', props);
}

/** Render the track that contains the changing range. */
function ProgressTrackImpl(props: ProgressRuntimePartProps): JSX.Element {
  return renderProgressPart('track', props);
}

/** Render the machine-driven completion range. */
function ProgressRangeImpl(props: ProgressRuntimePartProps): JSX.Element {
  return renderProgressPart('range', props);
}

/** Render the machine's formatted progress value by default. */
function ProgressValueTextImpl(props: ProgressRuntimePartProps): JSX.Element {
  return renderProgressPart('valueText', props);
}

/** Type the label against its selected native element. */
export const ProgressLabel = ProgressLabelImpl as <As extends PrimitiveNativeTag = 'span'>(
  props: ProgressLabelProps<As>,
) => JSX.Element;

/** Type the track against its selected native element. */
export const ProgressTrack = ProgressTrackImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ProgressTrackProps<As>,
) => JSX.Element;

/** Type the range against its selected native element. */
export const ProgressRange = ProgressRangeImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ProgressRangeProps<As>,
) => JSX.Element;

/** Type the value text against its selected native element. */
export const ProgressValueText = ProgressValueTextImpl as <As extends PrimitiveNativeTag = 'span'>(
  props: ProgressValueTextProps<As>,
) => JSX.Element;
