import { type JSX } from '@solidjs/web';
import { CloseIcon } from './close-icon';
import { ComboboxChevronIcon } from './combobox-icons';
import { renderComboboxPart } from './combobox-part';
import type {
  ComboboxClearTriggerProps,
  ComboboxContentProps,
  ComboboxControlProps,
  ComboboxEmptyProps,
  ComboboxIndicatorGroupProps,
  ComboboxInputProps,
  ComboboxLabelProps,
  ComboboxListProps,
  ComboboxStatusProps,
  ComboboxPositionerProps,
  ComboboxTriggerProps,
} from './combobox-part-props';
import type { ComponentIntrinsicElement } from './component-element-props';

/** Group the input with its machine-owned controls. */
export function ComboboxControl<As extends ComponentIntrinsicElement = 'div'>(
  props: ComboboxControlProps<As>,
): JSX.Element {
  return renderComboboxPart('control', props);
}

/** Render the editable input and forward its primitive combobox semantics. */
export function ComboboxInput<As extends ComponentIntrinsicElement = 'input'>(
  props: ComboboxInputProps<As>,
): JSX.Element {
  return renderComboboxPart('input', props);
}

/** Open the collection while retaining the primitive's focus behavior. */
export function ComboboxTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: ComboboxTriggerProps<As>,
): JSX.Element {
  return renderComboboxPart('trigger', props, ComboboxChevronIcon);
}

/** Clear the selected value through the primitive's button behavior. */
export function ComboboxClearTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: ComboboxClearTriggerProps<As>,
): JSX.Element {
  return renderComboboxPart('clearTrigger', props, CloseIcon);
}

/** Place trigger and clear buttons over the input without owning state. */
export function ComboboxIndicatorGroup<As extends ComponentIntrinsicElement = 'div'>(
  props: ComboboxIndicatorGroupProps<As>,
): JSX.Element {
  return renderComboboxPart('indicatorGroup', props);
}

/** Associate visible label text with the primitive input. */
export function ComboboxLabel<As extends ComponentIntrinsicElement = 'label'>(
  props: ComboboxLabelProps<As>,
): JSX.Element {
  return renderComboboxPart('label', props);
}

/** Position the popup against the current Combobox anchor. */
export function ComboboxPositioner<As extends ComponentIntrinsicElement = 'div'>(
  props: ComboboxPositionerProps<As>,
): JSX.Element {
  return renderComboboxPart('positioner', props);
}

/** Render the popup under the primitive's presence and interaction state. */
export function ComboboxContent<As extends ComponentIntrinsicElement = 'div'>(
  props: ComboboxContentProps<As>,
): JSX.Element {
  return renderComboboxPart('content', props);
}

/** Expose the listbox role and collection navigation semantics. */
export function ComboboxList<As extends ComponentIntrinsicElement = 'div'>(
  props: ComboboxListProps<As>,
): JSX.Element {
  return renderComboboxPart('list', props);
}

/** Announce loading or error states beside the list of options. */
export function ComboboxStatus<As extends ComponentIntrinsicElement = 'div'>(
  props: ComboboxStatusProps<As>,
): JSX.Element {
  return renderComboboxPart('status', props);
}

/** Show fallback content when the filtered collection is empty; place it beside the List. */
export function ComboboxEmpty<As extends ComponentIntrinsicElement = 'div'>(
  props: ComboboxEmptyProps<As>,
): JSX.Element {
  return renderComboboxPart('empty', props);
}
