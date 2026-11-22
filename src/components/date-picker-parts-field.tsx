import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { renderDatePickerPart } from './date-picker-part';
import type {
  DatePickerClearTriggerProps,
  DatePickerContentProps,
  DatePickerControlProps,
  DatePickerIndicatorGroupProps,
  DatePickerInputProps,
  DatePickerLabelProps,
  DatePickerMonthSelectProps,
  DatePickerNextTriggerProps,
  DatePickerPositionerProps,
  DatePickerPresetTriggerProps,
  DatePickerPrevTriggerProps,
  DatePickerRangeTextProps,
  DatePickerTriggerProps,
  DatePickerValueTextProps,
  DatePickerViewControlProps,
  DatePickerViewTriggerProps,
  DatePickerYearSelectProps,
} from './date-picker-part-props';

/** Clear the current date selection through the primitive machine. */
export function DatePickerClearTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: DatePickerClearTriggerProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'clearTrigger', props });
}

/** Render the calendar overlay with the primitive presence behavior. */
export function DatePickerContent<As extends ComponentIntrinsicElement = 'div'>(
  props: DatePickerContentProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'content', props });
}

/** Group the visible date fields and their triggers. */
export function DatePickerControl<As extends ComponentIntrinsicElement = 'div'>(
  props: DatePickerControlProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'control', props });
}

/** Align the trigger and clear affordances beside the input. */
export function DatePickerIndicatorGroup<As extends ComponentIntrinsicElement = 'div'>(
  props: DatePickerIndicatorGroupProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'indicatorGroup', props });
}

/** Render one typed date field backed by the picker machine. */
export function DatePickerInput<As extends ComponentIntrinsicElement = 'input'>(
  props: DatePickerInputProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'input', props });
}

/** Associate visible label text with the picker's fields. */
export function DatePickerLabel<As extends ComponentIntrinsicElement = 'label'>(
  props: DatePickerLabelProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'label', props });
}

/** Select the visible month using the primitive's calendar controls. */
export function DatePickerMonthSelect<As extends ComponentIntrinsicElement = 'select'>(
  props: DatePickerMonthSelectProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'monthSelect', props });
}

/** Move the visible calendar range forward. */
export function DatePickerNextTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: DatePickerNextTriggerProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'nextTrigger', props });
}

/** Position the calendar content relative to its trigger. */
export function DatePickerPositioner<As extends ComponentIntrinsicElement = 'div'>(
  props: DatePickerPositionerProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'positioner', props });
}

/** Apply a predefined date range through the primitive machine. */
export function DatePickerPresetTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: DatePickerPresetTriggerProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'presetTrigger', props });
}

/** Move the visible calendar range backward. */
export function DatePickerPrevTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: DatePickerPrevTriggerProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'prevTrigger', props });
}

/** Announce the visible date range in the calendar header. */
export function DatePickerRangeText<As extends ComponentIntrinsicElement = 'div'>(
  props: DatePickerRangeTextProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'rangeText', props });
}

/** Open the calendar from its field control. */
export function DatePickerTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: DatePickerTriggerProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'trigger', props });
}

/** Display selected date strings or render each selected value. */
export function DatePickerValueText<As extends ComponentIntrinsicElement = 'span'>(
  props: DatePickerValueTextProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'valueText', props });
}

/** Group calendar range navigation and view selection. */
export function DatePickerViewControl<As extends ComponentIntrinsicElement = 'div'>(
  props: DatePickerViewControlProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'viewControl', props });
}

/** Move to the next permitted calendar view. */
export function DatePickerViewTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: DatePickerViewTriggerProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'viewTrigger', props });
}

/** Select the visible year using the primitive's calendar controls. */
export function DatePickerYearSelect<As extends ComponentIntrinsicElement = 'select'>(
  props: DatePickerYearSelectProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'yearSelect', props });
}
