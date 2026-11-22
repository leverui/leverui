import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderDateInputPart } from './date-input-part';
import type {
  DateInputControlProps,
  DateInputHiddenInputProps,
  DateInputLabelProps,
  DateInputSegmentGroupProps,
  DateInputSegmentProps,
} from './date-input-part-props';

/** Associate visible text with every date segment in the root. */
export function DateInputLabel<As extends PrimitiveNativeTag = 'label'>(
  props: DateInputLabelProps<As>,
): JSX.Element {
  return renderDateInputPart({ slot: 'label', props });
}

/** Group the segmented date control and optional companion actions. */
export function DateInputControl<As extends PrimitiveNativeTag = 'div'>(
  props: DateInputControlProps<As>,
): JSX.Element {
  return renderDateInputPart({ slot: 'control', props });
}

/** Establish the selection index and keyboard context for date segments. */
export function DateInputSegmentGroup<As extends PrimitiveNativeTag = 'div'>(
  props: DateInputSegmentGroupProps<As>,
): JSX.Element {
  return renderDateInputPart({ slot: 'segmentGroup', props });
}

/** Render one interactive or literal machine date segment. */
export function DateInputSegment<As extends PrimitiveNativeTag = 'span'>(
  props: DateInputSegmentProps<As>,
): JSX.Element {
  return renderDateInputPart({ slot: 'segment', props });
}

/** Synchronize one selected date value with its native form input. */
export function DateInputHiddenInput<As extends PrimitiveNativeTag = 'input'>(
  props: DateInputHiddenInputProps<As>,
): JSX.Element {
  return renderDateInputPart({ slot: 'hiddenInput', props });
}
