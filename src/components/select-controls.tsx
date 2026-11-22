import { type JSX } from '@solidjs/web';
import { CloseIcon } from './close-icon';
import type { ComponentIntrinsicElement } from './component-element-props';
import { SelectChevronIcon } from './select-icons';
import { renderSelectPart } from './select-part';
import type {
  SelectClearTriggerProps,
  SelectControlProps,
  SelectIndicatorGroupProps,
  SelectIndicatorProps,
  SelectLabelProps,
  SelectTriggerProps,
  SelectValueTextProps,
} from './select-part-props';

/** Label the current Select collection and native hidden select. */
export function SelectLabel<As extends ComponentIntrinsicElement = 'label'>(
  props: SelectLabelProps<As>,
): JSX.Element {
  return renderSelectPart('label', props);
}

/** Position trigger and indicator controls together. */
export function SelectControl<As extends ComponentIntrinsicElement = 'div'>(
  props: SelectControlProps<As>,
): JSX.Element {
  return renderSelectPart('control', props);
}

/** Open the Select collection through the primitive's trigger behavior. */
export function SelectTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: SelectTriggerProps<As>,
): JSX.Element {
  return renderSelectPart('trigger', props);
}

/** Display selected collection text or a caller placeholder. */
export function SelectValueText<As extends ComponentIntrinsicElement = 'span'>(
  props: SelectValueTextProps<As>,
): JSX.Element {
  return renderSelectPart('valueText', props);
}

/** Align the visual indicator and optional clear trigger. */
export function SelectIndicatorGroup<As extends ComponentIntrinsicElement = 'div'>(
  props: SelectIndicatorGroupProps<As>,
): JSX.Element {
  return renderSelectPart('indicatorGroup', props);
}

/** Show the default chevron while following the primitive open state. */
export function SelectIndicator<As extends ComponentIntrinsicElement = 'div'>(
  props: SelectIndicatorProps<As>,
): JSX.Element {
  return renderSelectPart('indicator', props, SelectChevronIcon);
}

/** Clear the selected value through the primitive's native control. */
export function SelectClearTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: SelectClearTriggerProps<As>,
): JSX.Element {
  return renderSelectPart('clearTrigger', props, CloseIcon);
}
