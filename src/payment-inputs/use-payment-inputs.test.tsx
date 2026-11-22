import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library';
import { Show, flush } from 'solid-js';
import { afterEach, expect, test, vi } from 'vitest';
import { cardImages } from './card-images';
import type { UsePaymentInputsOptions, UsePaymentInputsReturn } from './payment-types';
import { usePaymentInputs } from './use-payment-inputs';

let payment: UsePaymentInputsReturn | undefined;

afterEach(
  /** Unmount the form between tests. */
  () => {
    cleanup();
    payment = undefined;
  },
);

/** Render the four payment fields and a brand image, keeping the hook result for assertions. */
function renderPaymentForm(options: UsePaymentInputsOptions = {}): UsePaymentInputsReturn {
  render(
    /** Mount the fields the way an app spreads the getters. */
    () => {
      const result = usePaymentInputs(options);
      payment = result;
      return (
        <div data-testid="wrapper" {...result.wrapperProps}>
          <Show when={result.meta.cardType} fallback={<span>No brand</span>}>
            <svg {...result.getCardImageProps({ images: cardImages })} />
          </Show>
          <input {...result.getCardNumberProps()} />
          <input {...result.getExpiryDateProps()} />
          <input {...result.getCVCProps()} />
          <input {...result.getZIPProps()} />
        </div>
      );
    },
  );
  if (!payment) throw new Error('The payment form did not mount.');
  // Field registration settles after mount; apply its writes before reading the state.
  flush();
  return payment;
}

/** Replace a field's value and dispatch the input event a reader's typing would. */
function typeInto(input: HTMLElement, value: string): void {
  (input as HTMLInputElement).value = value;
  fireEvent(input, new InputEvent('input', { bubbles: true, data: value.slice(-1) }));
}

test('starts with default attributes and the first missing-field error', () => {
  const { meta } = renderPaymentForm();
  const number = screen.getByPlaceholderText('Card number');
  expect(number.getAttribute('autocomplete')).toBe('cc-number');
  expect(number.getAttribute('type')).toBe('tel');
  expect(screen.getByLabelText('Expiry date in format MM YY')).toBeTruthy();
  expect(screen.getByPlaceholderText('ZIP').getAttribute('maxlength')).toBe('6');
  expect(meta.error).toBe('Enter a card number');
  expect(meta.erroredInputs.zip).toBe('Enter a ZIP code');
  expect(screen.getByText('No brand')).toBeTruthy();
});

test('formats the number, shows its brand, and moves on once it is valid', () => {
  const onChange = vi.fn();
  const { meta } = renderPaymentForm({ onChange });
  const number = screen.getByPlaceholderText('Card number') as HTMLInputElement;
  number.focus();
  typeInto(number, '4242424242424242');
  expect(number.value).toBe('4242 4242 4242 4242');
  expect(meta.cardType?.type).toBe('visa');
  expect(meta.erroredInputs.cardNumber).toBeUndefined();
  expect(screen.getByRole('img', { name: 'Visa' })).toBeTruthy();
  expect(document.activeElement).toBe(screen.getByPlaceholderText('MM/YY'));
  expect(onChange).toHaveBeenCalledOnce();
});

test('names the security code for the brand and limits its length', () => {
  renderPaymentForm();
  typeInto(screen.getByPlaceholderText('Card number'), '378282246310005');
  const cvc = screen.getByPlaceholderText('CID') as HTMLInputElement;
  cvc.value = '1234';
  const extra = new InputEvent('beforeinput', {
    bubbles: true,
    cancelable: true,
    data: '5',
    inputType: 'insertText',
  });
  cvc.dispatchEvent(extra);
  expect(extra.defaultPrevented).toBe(true);
  const letter = new InputEvent('beforeinput', {
    bubbles: true,
    cancelable: true,
    data: 'a',
    inputType: 'insertText',
  });
  screen.getByPlaceholderText('ZIP').dispatchEvent(letter);
  expect(letter.defaultPrevented).toBe(true);
});

test('formats the expiry date and returns to the previous field on Backspace', () => {
  const { meta } = renderPaymentForm({ autoFocus: true });
  const expiry = screen.getByPlaceholderText('MM/YY') as HTMLInputElement;
  typeInto(expiry, '3');
  expect(expiry.value).toBe('03 / ');
  typeInto(expiry, '');
  expect(meta.erroredInputs.expiryDate).toBe('Enter an expiry date');
  expiry.focus();
  fireEvent.keyDown(expiry, { key: 'Backspace' });
  expect(document.activeElement).toBe(screen.getByPlaceholderText('Card number'));
});

test('runs caller handlers and custom messages alongside the hook', () => {
  const onInput = vi.fn();
  const onError = vi.fn();
  render(
    /** Pass caller props through a field getter. */
    () => {
      const result = usePaymentInputs({ errorMessages: { invalidCardNumber: 'Check the number' } });
      return <input {...result.getCardNumberProps({ onInput, onError, class: 'custom' })} />;
    },
  );
  const number = screen.getByPlaceholderText('Card number');
  expect(number.classList.contains('custom')).toBe(true);
  typeInto(number, '4242');
  expect(onInput).toHaveBeenCalledOnce();
  expect(onError).toHaveBeenCalledWith('Check the number');
});

test('marks the wrapper while a field has focus', () => {
  renderPaymentForm();
  const wrapper = screen.getByTestId('wrapper');
  expect(wrapper.hasAttribute('data-focus')).toBe(false);
  fireEvent.focus(screen.getByPlaceholderText('ZIP'));
  expect(wrapper.hasAttribute('data-focus')).toBe(true);
});
