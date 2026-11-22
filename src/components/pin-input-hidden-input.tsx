import {
  PinInput as PrimitivePinInput,
  usePinInputContext,
} from '../primitives/components/pin-input';
import type { PolymorphicProps } from '../primitives/components/factory';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { invokeEventHandler } from '../merge-props';

export type PinInputHiddenInputProps = JSX.IntrinsicElements['input'] & PolymorphicProps<'input'>;

/**
 * Preserve the primitive's native form input behind a Lever UI-owned public type.
 *
 * A `Field.Label` points at this hidden input. Zag 2 no longer moves its focus
 * to the visible fields, so Lever forwards focus to the current field, as Zag 1
 * did, after the caller's own handler.
 */
export function PinInputHiddenInput(props: PinInputHiddenInputProps): JSX.Element {
  const pinInput = usePinInputContext();

  /** Run the caller's handler, then focus the pin field that accepts input next. */
  function onFocus(event: FocusEvent & { currentTarget: HTMLInputElement; target: Element }): void {
    invokeEventHandler(props.onFocus, event.currentTarget, event);
    if (!event.defaultPrevented) pinInput().focus();
  }

  const inputProps = mergeProps(props, { onFocus });
  return <PrimitivePinInput.HiddenInput {...inputProps} />;
}
