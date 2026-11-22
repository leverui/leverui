import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderPinInputPart } from './pin-input-part';
import type {
  PinInputControlProps,
  PinInputInputProps,
  PinInputLabelProps,
} from './pin-input-part-props';

/** Group the machine-owned Pin Input fields. */
export function PinInputControl<As extends PrimitiveNativeTag = 'div'>(
  props: PinInputControlProps<As>,
): JSX.Element {
  return renderPinInputPart('control', props);
}

/** Render one indexed Pin Input field. */
export function PinInputInput<As extends PrimitiveNativeTag = 'input'>(
  props: PinInputInputProps<As>,
): JSX.Element {
  return renderPinInputPart('input', props);
}

/** Associate a visible label with the Pin Input fields. */
export function PinInputLabel<As extends PrimitiveNativeTag = 'label'>(
  props: PinInputLabelProps<As>,
): JSX.Element {
  return renderPinInputPart('label', props);
}
