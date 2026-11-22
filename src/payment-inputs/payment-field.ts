import { splitProps } from '../primitives/utils/split-props';
import { mergeProps } from '../primitives/utils/merge-props';
import { invokeEventHandler } from '../merge-props';
import { mergeRefs, type LeverUIRef } from '../merge-refs';
import type { PaymentMetaController } from './payment-meta';
import type {
  PaymentField,
  PaymentFieldProps,
  PaymentInputAttributes,
  UsePaymentInputsOptions,
} from './payment-types';

type FieldInputEvent = InputEvent & { currentTarget: HTMLInputElement };

/** How one payment field formats, validates, and hands focus to its neighbours. */
export interface PaymentFieldBehavior {
  readonly name: PaymentField;
  /** Native attributes the caller's props may override. */
  readonly defaults: PaymentInputAttributes;
  readonly register: (input: HTMLInputElement) => void;
  /** Format the edited value in place and return the field's validation message. */
  readonly update: (input: HTMLInputElement, event: FieldInputEvent) => string | undefined;
  /** Whether the field has room for another typed character. */
  readonly accepts: (value: string) => boolean;
  readonly next?: () => HTMLInputElement | undefined;
  readonly previous?: () => HTMLInputElement | undefined;
}

const handlerNames = [
  'ref',
  'onBlur',
  'onFocus',
  'onInput',
  'onKeyDown',
  'onBeforeInput',
  'onError',
] as const;

/**
 * Build one field's props: the behaviour's defaults, then the caller's props, then handlers
 * that run the caller's own handler and the hook's formatting, validation, and focus moves.
 */
export function paymentFieldProps(
  behavior: PaymentFieldBehavior,
  controller: PaymentMetaController,
  options: UsePaymentInputsOptions,
  props: PaymentFieldProps = {},
): PaymentInputAttributes {
  const [local, others] = splitProps(props, handlerNames);
  /** Read the focus-moving option, which defaults to on. */
  const autoFocus = () => options.autoFocus ?? true;

  /** Mark the field left and no longer focused. */
  function onBlur(event: FocusEvent & { currentTarget: HTMLInputElement }): void {
    invokeEventHandler(local.onBlur, event.currentTarget, event);
    options.onBlur?.(event);
    controller.setFocused(undefined);
    controller.setInputTouched(behavior.name, true);
  }

  /** Record which field has focus. */
  function onFocus(event: FocusEvent & { currentTarget: HTMLInputElement }): void {
    invokeEventHandler(local.onFocus, event.currentTarget, event);
    controller.setFocused(behavior.name);
  }

  /** Format and validate the edit, then advance once the field is complete. */
  function onInput(event: FieldInputEvent): void {
    controller.setInputTouched(behavior.name, false);
    const error = behavior.update(event.currentTarget, event);
    invokeEventHandler(local.onInput, event.currentTarget, event);
    options.onChange?.(event);
    if (!error && autoFocus()) behavior.next?.()?.focus();
    controller.setInputError(behavior.name, error);
    local.onError?.(error);
  }

  /** Return to the previous field when Backspace is pressed in an empty one. */
  function onKeyDown(event: KeyboardEvent & { currentTarget: HTMLInputElement }): void {
    invokeEventHandler(local.onKeyDown, event.currentTarget, event);
    if (event.key === 'Backspace' && !event.currentTarget.value && autoFocus()) {
      behavior.previous?.()?.focus();
    }
  }

  /** Refuse typed characters that are not digits, or that would overfill the field. */
  function onBeforeInput(event: FieldInputEvent): void {
    const input = event.currentTarget;
    invokeEventHandler(local.onBeforeInput, input, event);
    if (event.inputType !== 'insertText' || !event.data) return;
    const replacesSelection = input.selectionStart !== input.selectionEnd;
    if (!/^\d*$/.test(event.data) || (!replacesSelection && !behavior.accepts(input.value))) {
      event.preventDefault();
    }
  }

  const handlers: PaymentInputAttributes = {
    ref: mergeRefs(local.ref as LeverUIRef<HTMLInputElement>, behavior.register),
    onBlur,
    onFocus,
    onInput,
    onKeyDown,
    onBeforeInput,
  };
  const fieldProps: PaymentInputAttributes = others;
  return mergeProps(behavior.defaults, fieldProps, handlers);
}
