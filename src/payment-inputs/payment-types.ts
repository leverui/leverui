import { type JSX } from '@solidjs/web';
import type { CardBrand, CardType } from './card-types';
import type {
  CardNumberValidator,
  CVCValidator,
  ExpiryValidator,
  PaymentErrorMessages,
} from './validator';

/** The four payment fields the hook can manage. */
export type PaymentField = 'cardNumber' | 'expiryDate' | 'cvc' | 'zip';

/** Each field's current validation message; undefined when the field is valid. */
export type PaymentErroredInputs = Readonly<Record<PaymentField, string | undefined>>;

/** Whether each field has been left since its last edit. */
export type PaymentTouchedInputs = Readonly<Record<PaymentField, boolean>>;

/** Reactive state for the payment fields. Each property is read on access. */
export interface PaymentMeta {
  readonly cardType: CardType | undefined;
  readonly erroredInputs: PaymentErroredInputs;
  /** The first field error, in field order. */
  readonly error: string | undefined;
  readonly focused: PaymentField | undefined;
  /** True after focus leaves every payment field. */
  readonly isTouched: boolean;
  readonly touchedInputs: PaymentTouchedInputs;
}

/** Options for `usePaymentInputs`. Each is read when it is needed, so getters stay reactive. */
export interface UsePaymentInputsOptions {
  /** Move focus to the next field once a field is valid, and back on Backspace. Defaults to true. */
  readonly autoFocus?: boolean;
  readonly errorMessages?: PaymentErrorMessages;
  readonly cardNumberValidator?: CardNumberValidator;
  readonly expiryValidator?: ExpiryValidator;
  readonly cvcValidator?: CVCValidator;
  /** Called when any payment field loses focus. */
  readonly onBlur?: (event: FocusEvent) => void;
  /** Called after any payment field's value is formatted for an edit. */
  readonly onChange?: (event: InputEvent) => void;
  /** Called when the set of field errors changes, with the first error. */
  readonly onError?: (error: string | undefined, erroredInputs: PaymentErroredInputs) => void;
  /** Called when a field's touched state changes. */
  readonly onTouch?: (
    changed: Partial<PaymentTouchedInputs>,
    touchedInputs: PaymentTouchedInputs,
  ) => void;
}

/**
 * Native input attributes a payment getter accepts and returns. The native `size` width is left
 * out so the result also spreads onto `Input`, whose `size` picks its geometry.
 */
export type PaymentInputAttributes = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'size'>;

/** Props a caller adds to a payment field. Its handlers run alongside the hook's own. */
export type PaymentFieldProps = PaymentInputAttributes & {
  /** Called with this field's validation message after each edit. */
  readonly onError?: (error: string | undefined) => void;
};

/** Brand marks for `getCardImageProps`, each drawn in a 24 by 16 view box. */
export type CardImages = Partial<Record<CardBrand | 'placeholder', () => JSX.Element>>;

/** Props a caller adds to the card image `<svg>`, plus the brand marks to draw. */
export type CardImageProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  readonly images?: CardImages;
};

/** Data attributes for an element that wraps the payment fields. */
export interface PaymentWrapperProps {
  /** Present while one of the fields has focus. */
  readonly 'data-focus': '' | undefined;
  /** Present when the fields have been left and one of them has an error. */
  readonly 'data-invalid': '' | undefined;
}

/** Prop getters and state returned by `usePaymentInputs`. */
export interface UsePaymentInputsReturn {
  readonly getCardNumberProps: (props?: PaymentFieldProps) => PaymentInputAttributes;
  readonly getExpiryDateProps: (props?: PaymentFieldProps) => PaymentInputAttributes;
  readonly getCVCProps: (props?: PaymentFieldProps) => PaymentInputAttributes;
  readonly getZIPProps: (props?: PaymentFieldProps) => PaymentInputAttributes;
  readonly getCardImageProps: (props?: CardImageProps) => JSX.SvgSVGAttributes<SVGSVGElement>;
  readonly wrapperProps: PaymentWrapperProps;
  readonly meta: PaymentMeta;
}
