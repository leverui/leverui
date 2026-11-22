import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { NumberInputDownIcon, NumberInputUpIcon } from './number-input-icons';
import { renderNumberInputPart } from './number-input-part';
import type {
  NumberInputControlProps,
  NumberInputDecrementTriggerProps,
  NumberInputHiddenInputProps,
  NumberInputIncrementTriggerProps,
  NumberInputInputProps,
  NumberInputLabelProps,
  NumberInputScrubberProps,
  NumberInputValueTextProps,
} from './number-input-part-props';

/** Group the machine-owned increment and decrement controls. */
export function NumberInputControl<As extends PrimitiveNativeTag = 'div'>(
  props: NumberInputControlProps<As>,
): JSX.Element {
  return renderNumberInputPart(
    'control',
    props,
    /** Create default controls only when no consumer children were supplied. */
    () => (
      <>
        <NumberInputIncrementTrigger />
        <NumberInputDecrementTrigger />
      </>
    ),
  );
}

/** Decrement the current value through the primitive's Number Input machine. */
export function NumberInputDecrementTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: NumberInputDecrementTriggerProps<As>,
): JSX.Element {
  return renderNumberInputPart(
    'decrementTrigger',
    props,
    /** Create the default icon only when the trigger needs it. */
    () => <NumberInputDownIcon />,
  );
}

/** Increment the current value through the primitive's Number Input machine. */
export function NumberInputIncrementTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: NumberInputIncrementTriggerProps<As>,
): JSX.Element {
  return renderNumberInputPart(
    'incrementTrigger',
    props,
    /** Create the default icon only when the trigger needs it. */
    () => <NumberInputUpIcon />,
  );
}

/** Submit the raw number with a form; render it when the root has a `name`. */
export function NumberInputHiddenInput<As extends PrimitiveNativeTag = 'input'>(
  props: NumberInputHiddenInputProps<As>,
): JSX.Element {
  return renderNumberInputPart('hiddenInput', props);
}

/** Render the machine-owned numeric text field. */
export function NumberInputInput<As extends PrimitiveNativeTag = 'input'>(
  props: NumberInputInputProps<As>,
): JSX.Element {
  return renderNumberInputPart('input', props);
}

/** Associate a visible label with the numeric input. */
export function NumberInputLabel<As extends PrimitiveNativeTag = 'label'>(
  props: NumberInputLabelProps<As>,
): JSX.Element {
  return renderNumberInputPart('label', props);
}

/** Enable pointer scrubbing through the primitive's Number Input machine. */
export function NumberInputScrubber<As extends PrimitiveNativeTag = 'div'>(
  props: NumberInputScrubberProps<As>,
): JSX.Element {
  return renderNumberInputPart('scrubber', props);
}

/** Display the machine's formatted numeric value. */
export function NumberInputValueText<As extends PrimitiveNativeTag = 'span'>(
  props: NumberInputValueTextProps<As>,
): JSX.Element {
  return renderNumberInputPart('valueText', props);
}
