import { getCardTypeByValue, type CardType } from './card-types';

/** Replacement text for any of the built-in validation messages. */
export interface PaymentErrorMessages {
  readonly emptyCardNumber?: string;
  readonly invalidCardNumber?: string;
  readonly emptyExpiryDate?: string;
  readonly invalidExpiryDate?: string;
  readonly monthOutOfRange?: string;
  readonly yearOutOfRange?: string;
  readonly dateOutOfRange?: string;
  readonly emptyCVC?: string;
  readonly invalidCVC?: string;
  readonly emptyZIP?: string;
}

/** Extra card-number check, run after the built-in length and Luhn checks pass. */
export type CardNumberValidator = (input: {
  readonly cardNumber: string;
  readonly cardType: CardType;
  readonly errorMessages: PaymentErrorMessages;
}) => string | undefined;

/** Extra expiry check, run after the built-in month and past-date checks pass. */
export type ExpiryValidator = (input: {
  readonly expiryDate: { readonly month: string; readonly year: string };
  readonly errorMessages: PaymentErrorMessages;
}) => string | undefined;

/** Extra security-code check, run after the built-in length checks pass. */
export type CVCValidator = (input: {
  readonly cvc: string;
  readonly cardType: CardType | undefined;
  readonly errorMessages: PaymentErrorMessages;
}) => string | undefined;

export const EMPTY_CARD_NUMBER = 'Enter a card number';
export const EMPTY_EXPIRY_DATE = 'Enter an expiry date';
export const EMPTY_CVC = 'Enter a CVC';
export const EMPTY_ZIP = 'Enter a ZIP code';
export const INVALID_CARD_NUMBER = 'Card number is invalid';
export const INVALID_EXPIRY_DATE = 'Expiry date is invalid';
export const INVALID_CVC = 'CVC is invalid';
export const MONTH_OUT_OF_RANGE = 'Expiry month must be between 01 and 12';
export const YEAR_OUT_OF_RANGE = 'Expiry year cannot be in the past';
export const DATE_OUT_OF_RANGE = 'Expiry date cannot be in the past';

const monthPattern = /(0[1-9]|1[0-2])/;

/** Report whether a number already has its brand's longest allowed length. */
export function hasCardNumberReachedMaxLength(value: string): boolean {
  const cardType = getCardTypeByValue(value);
  const longest = cardType?.lengths.at(-1);
  return longest !== undefined && value.length >= longest;
}

/** Check a digit string with the Luhn checksum that card numbers carry. */
export function validateLuhn(cardNumber: string): boolean {
  let sum = 0;
  [...cardNumber].reverse().forEach(
    /** Double every second digit from the right, folding two-digit results. */
    (character, index) => {
      const digit = Number.parseInt(character, 10) * (index % 2 ? 2 : 1);
      sum += digit > 9 ? (digit % 10) + 1 : digit;
    },
  );
  return sum % 10 === 0;
}

/** Explain why a card number cannot be used, or return undefined when it is valid. */
export function getCardNumberError(
  cardNumber: string,
  validator?: CardNumberValidator,
  { errorMessages = {} }: { readonly errorMessages?: PaymentErrorMessages } = {},
): string | undefined {
  if (!cardNumber) return errorMessages.emptyCardNumber ?? EMPTY_CARD_NUMBER;
  const digits = cardNumber.replace(/\s/g, '');
  const cardType = getCardTypeByValue(digits);
  if (cardType?.lengths.includes(digits.length) && validateLuhn(digits)) {
    return validator?.({ cardNumber: digits, cardType, errorMessages });
  }
  return errorMessages.invalidCardNumber ?? INVALID_CARD_NUMBER;
}

/** Explain why an `MM / YY` expiry date cannot be used, or return undefined when it is valid. */
export function getExpiryDateError(
  expiryDate: string,
  validator?: ExpiryValidator,
  { errorMessages = {} }: { readonly errorMessages?: PaymentErrorMessages } = {},
): string | undefined {
  if (!expiryDate) return errorMessages.emptyExpiryDate ?? EMPTY_EXPIRY_DATE;
  const digits = expiryDate.replace(' / ', '').replace('/', '');
  if (digits.length !== 4) return errorMessages.invalidExpiryDate ?? INVALID_EXPIRY_DATE;
  const month = digits.slice(0, 2);
  const year = `20${digits.slice(2, 4)}`;
  const today = new Date();
  if (!monthPattern.test(month)) return errorMessages.monthOutOfRange ?? MONTH_OUT_OF_RANGE;
  if (Number(year) < today.getFullYear()) {
    return errorMessages.yearOutOfRange ?? YEAR_OUT_OF_RANGE;
  }
  if (Number(year) === today.getFullYear() && Number(month) < today.getMonth() + 1) {
    return errorMessages.dateOutOfRange ?? DATE_OUT_OF_RANGE;
  }
  return validator?.({ expiryDate: { month, year }, errorMessages });
}

/** Explain why a security code cannot be used with the card, or return undefined when valid. */
export function getCVCError(
  cvc: string,
  validator?: CVCValidator,
  {
    cardType,
    errorMessages = {},
  }: {
    readonly cardType?: CardType | undefined;
    readonly errorMessages?: PaymentErrorMessages;
  } = {},
): string | undefined {
  if (!cvc) return errorMessages.emptyCVC ?? EMPTY_CVC;
  if (cvc.length < 3 || (cardType && cvc.length !== cardType.code.length)) {
    return errorMessages.invalidCVC ?? INVALID_CVC;
  }
  return validator?.({ cvc, cardType, errorMessages });
}

/** Explain why a ZIP code is missing, or return undefined when one is entered. */
export function getZIPError(
  zip: string,
  { errorMessages = {} }: { readonly errorMessages?: PaymentErrorMessages } = {},
): string | undefined {
  return zip ? undefined : (errorMessages.emptyZIP ?? EMPTY_ZIP);
}
