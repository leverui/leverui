import { splitProps } from '../primitives/utils/split-props';
import { onSettled } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { getCardTypeByValue } from './card-types';
import { formatCardNumber, formatExpiry } from './formatter';
import { paymentFieldProps, type PaymentFieldBehavior } from './payment-field';
import {
  cardNumberBehavior,
  cvcBehavior,
  expiryDateBehavior,
  zipBehavior,
  type PaymentFieldElements,
} from './payment-fields';
import { createPaymentMeta } from './payment-meta';
import type {
  CardImageProps,
  PaymentFieldProps,
  PaymentWrapperProps,
  UsePaymentInputsOptions,
  UsePaymentInputsReturn,
} from './payment-types';
import { getCardNumberError, getCVCError, getExpiryDateError, getZIPError } from './validator';

type SvgProps = JSX.SvgSVGAttributes<SVGSVGElement>;

/**
 * Format, validate, and connect card-number, expiry, security-code, and ZIP inputs. Spread
 * each getter's result on its input; the fields stay uncontrolled, and `meta` reports their
 * state reactively.
 */
export function usePaymentInputs(options: UsePaymentInputsOptions = {}): UsePaymentInputsReturn {
  const controller = createPaymentMeta(options);
  const { meta } = controller;
  const fields: PaymentFieldElements = {};
  /** The custom messages in the shape the validators take. */
  const errorMessages = () => ({ errorMessages: options.errorMessages ?? {} });

  /** Bind one field's behaviour to the shared state for a caller's props. */
  function getter(behavior: PaymentFieldBehavior) {
    /** Return the field's props merged with the caller's. */
    return (props?: PaymentFieldProps) => paymentFieldProps(behavior, controller, options, props);
  }

  /** Draw the detected brand's mark, or the placeholder card when no brand matches. */
  function getCardImageProps(props: CardImageProps = {}): SvgProps {
    const [local, others] = splitProps(props, ['images']);
    const defaults: SvgProps = {
      /** Name the detected brand. */
      get 'aria-label'() {
        return meta.cardType?.displayName ?? 'Placeholder card';
      },
      role: 'img',
      width: '1.5em',
      height: '1em',
      viewBox: '0 0 24 16',
      /** Draw the detected brand's mark from the supplied images. */
      get children() {
        const images = local.images ?? {};
        const Image = images[meta.cardType?.type ?? 'placeholder'] ?? images.placeholder;
        return Image?.();
      },
    };
    return mergeProps<[SvgProps, SvgProps]>(defaults, others);
  }

  /** Format any default values and record each mounted field's starting error and brand. */
  function initializeFields(): void {
    if (fields.zip) controller.setInputError('zip', getZIPError(fields.zip.value, errorMessages()));
    if (fields.cvc) {
      const error = getCVCError(fields.cvc.value, options.cvcValidator, errorMessages());
      controller.setInputError('cvc', error);
    }
    if (fields.expiryDate) {
      const input = fields.expiryDate;
      input.value = formatExpiry(input.value);
      const error = getExpiryDateError(input.value, options.expiryValidator, errorMessages());
      controller.setInputError('expiryDate', error);
    }
    if (fields.cardNumber) {
      const input = fields.cardNumber;
      const error = getCardNumberError(input.value, options.cardNumberValidator, errorMessages());
      controller.setInputError('cardNumber', error);
      input.value = formatCardNumber(input.value);
      controller.setCardType(getCardTypeByValue(input.value));
    }
  }

  onSettled(initializeFields);

  const wrapperProps: PaymentWrapperProps = {
    /** Mark the wrapper while a field has focus. */
    get 'data-focus'() {
      return meta.focused ? '' : undefined;
    },
    /** Mark the wrapper once the reader has left a field with an error. */
    get 'data-invalid'() {
      return meta.isTouched && meta.error ? '' : undefined;
    },
  };

  return {
    getCardNumberProps: getter(cardNumberBehavior(fields, controller, options)),
    getExpiryDateProps: getter(expiryDateBehavior(fields, options)),
    getCVCProps: getter(cvcBehavior(fields, controller, options)),
    getZIPProps: getter(zipBehavior(fields, options)),
    getCardImageProps,
    wrapperProps,
    meta,
  };
}
