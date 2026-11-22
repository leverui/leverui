import { getCardTypeByValue } from './card-types';
import { formatCardNumber, formatExpiry } from './formatter';
import type { PaymentFieldBehavior } from './payment-field';
import type { PaymentMetaController } from './payment-meta';
import type { UsePaymentInputsOptions } from './payment-types';
import {
  getCardNumberError,
  getCVCError,
  getExpiryDateError,
  getZIPError,
  hasCardNumberReachedMaxLength,
} from './validator';

/** The mounted payment inputs, so a field can move focus to its neighbours. */
export interface PaymentFieldElements {
  cardNumber?: HTMLInputElement;
  expiryDate?: HTMLInputElement;
  cvc?: HTMLInputElement;
  zip?: HTMLInputElement;
}

/** Card number: group the digits for the detected brand and keep the caret beside them. */
export function cardNumberBehavior(
  fields: PaymentFieldElements,
  controller: PaymentMetaController,
  options: UsePaymentInputsOptions,
): PaymentFieldBehavior {
  return {
    name: 'cardNumber',
    defaults: {
      'aria-label': 'Card number',
      autocomplete: 'cc-number',
      id: 'cardNumber',
      name: 'cardNumber',
      placeholder: 'Card number',
      type: 'tel',
    },
    /** Keep the card-number input so other fields can focus it. */
    register: (input) => (fields.cardNumber = input),
    /** Regroup the digits, track the brand, and validate the number. */
    update(input) {
      const cardNumber = input.value.replace(/\s/g, '');
      let caret = input.selectionStart ?? input.value.length;
      controller.setCardType(getCardTypeByValue(cardNumber));
      input.value = formatCardNumber(cardNumber);
      requestAnimationFrame(
        /** Formatting moves the caret to the end; put it back after the edited digit. */
        () => {
          if (document.activeElement !== input) return;
          if (input.value[caret - 1] === ' ') caret += 1;
          input.setSelectionRange(caret, caret);
        },
      );
      return getCardNumberError(cardNumber, options.cardNumberValidator, {
        errorMessages: options.errorMessages ?? {},
      });
    },
    /** Allow digits until the brand's longest number. */
    accepts: (value) => !hasCardNumberReachedMaxLength(value.replace(/\s/g, '')),
    /** Continue to the expiry date. */
    next: () => fields.expiryDate,
  };
}

/** Expiry date: insert the `MM / YY` separator while the reader types. */
export function expiryDateBehavior(
  fields: PaymentFieldElements,
  options: UsePaymentInputsOptions,
): PaymentFieldBehavior {
  return {
    name: 'expiryDate',
    defaults: {
      'aria-label': 'Expiry date in format MM YY',
      autocomplete: 'cc-exp',
      id: 'expiryDate',
      name: 'expiryDate',
      placeholder: 'MM/YY',
      type: 'tel',
    },
    /** Keep the expiry input so other fields can focus it. */
    register: (input) => (fields.expiryDate = input),
    /** Insert the separator and validate the date. */
    update(input, event) {
      input.value = formatExpiry(input.value, event.data);
      return getExpiryDateError(input.value, options.expiryValidator, {
        errorMessages: options.errorMessages ?? {},
      });
    },
    /** Allow four digits. */
    accepts: (value) => value.replace(' / ', '').length < 4,
    /** Continue to the security code. */
    next: () => fields.cvc,
    /** Return to the card number. */
    previous: () => fields.cardNumber,
  };
}

/** Security code: its length and placeholder follow the detected card brand. */
export function cvcBehavior(
  fields: PaymentFieldElements,
  controller: PaymentMetaController,
  options: UsePaymentInputsOptions,
): PaymentFieldBehavior {
  return {
    name: 'cvc',
    defaults: {
      'aria-label': 'CVC',
      autocomplete: 'cc-csc',
      id: 'cvc',
      name: 'cvc',
      /** Name the code the way the detected brand does, such as CVV or CID. */
      get placeholder() {
        return controller.meta.cardType?.code.name ?? 'CVC';
      },
      type: 'tel',
    },
    /** Keep the security-code input so other fields can focus it. */
    register: (input) => (fields.cvc = input),
    /** Validate the code against the detected brand's length. */
    update: (input) =>
      getCVCError(input.value, options.cvcValidator, {
        cardType: controller.meta.cardType,
        errorMessages: options.errorMessages ?? {},
      }),
    /** Allow the brand's code length, at most four digits. */
    accepts(value) {
      const codeLength = controller.meta.cardType?.code.length ?? 4;
      return value.length < Math.min(codeLength, 4);
    },
    /** Continue to the ZIP code. */
    next: () => fields.zip,
    /** Return to the expiry date. */
    previous: () => fields.expiryDate,
  };
}

/** ZIP code: digits only, up to six. */
export function zipBehavior(
  fields: PaymentFieldElements,
  options: UsePaymentInputsOptions,
): PaymentFieldBehavior {
  return {
    name: 'zip',
    defaults: {
      autocomplete: 'off',
      id: 'zip',
      maxlength: 6,
      name: 'zip',
      placeholder: 'ZIP',
      type: 'tel',
    },
    /** Keep the ZIP input so the security code can focus it. */
    register: (input) => (fields.zip = input),
    /** Require a ZIP code. */
    update: (input) => getZIPError(input.value, { errorMessages: options.errorMessages ?? {} }),
    /** Leave the length to `maxlength`. */
    accepts: () => true,
    /** Return to the security code. */
    previous: () => fields.cvc,
  };
}
