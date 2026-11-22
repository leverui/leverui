import { flush } from 'solid-js';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { getCardTypeByType, getCardTypeByValue } from './card-types';
import { formatCardNumber, formatExpiry } from './formatter';
import {
  getCardNumberError,
  getCVCError,
  getExpiryDateError,
  getZIPError,
  hasCardNumberReachedMaxLength,
  validateLuhn,
} from './validator';

afterEach(
  /** Restore the real clock after the expiry checks. */
  () => {
    vi.useRealTimers();
  },
);

describe('card types', () => {
  test('detect each brand from its leading digits', () => {
    expect(getCardTypeByValue('4242')?.type).toBe('visa');
    expect(getCardTypeByValue('2221')?.type).toBe('mastercard');
    expect(getCardTypeByValue('3714')?.type).toBe('amex');
    expect(getCardTypeByValue('6011')?.type).toBe('discover');
    expect(getCardTypeByValue('9792')?.type).toBe('troy');
    expect(getCardTypeByValue('1234')).toBeUndefined();
    expect(getCardTypeByType('jcb')?.displayName).toBe('JCB');
  });
});

describe('formatter', () => {
  test('groups digits the way each brand prints them', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
    expect(formatCardNumber('378282246310005')).toBe('3782 822463 10005');
    expect(formatCardNumber('12ab34')).toBe('1234');
  });

  test('inserts and removes the expiry separator as the reader types', () => {
    expect(formatExpiry('1', '1')).toBe('1');
    expect(formatExpiry('3', '3')).toBe('03 / ');
    expect(formatExpiry('12', '2')).toBe('12 / ');
    expect(formatExpiry('13', '3')).toBe('01 / 3');
    expect(formatExpiry('1/', '/')).toBe('01 / ');
    expect(formatExpiry('12 / 2', '2')).toBe('12 / 2');
    expect(formatExpiry('12 /', null)).toBe('12');
    expect(formatExpiry('')).toBe('');
  });
});

describe('validator', () => {
  test('checks card numbers by brand length and Luhn checksum', () => {
    expect(validateLuhn('4242424242424242')).toBe(true);
    expect(validateLuhn('4242424242424241')).toBe(false);
    expect(getCardNumberError('')).toBe('Enter a card number');
    expect(getCardNumberError('4242 4242 4242 4242')).toBeUndefined();
    expect(getCardNumberError('4242 4242')).toBe('Card number is invalid');
    expect(
      getCardNumberError('', undefined, { errorMessages: { emptyCardNumber: 'Card needed' } }),
    ).toBe('Card needed');
    const validator = vi.fn(() => 'Cards from this bank are not accepted');
    expect(getCardNumberError('4242424242424242', validator)).toBe(
      'Cards from this bank are not accepted',
    );
    expect(validator).toHaveBeenCalledWith(
      expect.objectContaining({ cardNumber: '4242424242424242' }),
    );
    expect(hasCardNumberReachedMaxLength('4242424242424242424')).toBe(true);
    expect(hasCardNumberReachedMaxLength('4242')).toBe(false);
  });

  test('rejects expiry dates that are malformed or in the past', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15));
    flush();
    expect(getExpiryDateError('')).toBe('Enter an expiry date');
    expect(getExpiryDateError('12 / 2')).toBe('Expiry date is invalid');
    expect(getExpiryDateError('13 / 30')).toBe('Expiry month must be between 01 and 12');
    expect(getExpiryDateError('12 / 25')).toBe('Expiry year cannot be in the past');
    expect(getExpiryDateError('05 / 26')).toBe('Expiry date cannot be in the past');
    expect(getExpiryDateError('06 / 26')).toBeUndefined();
  });

  test('checks the security code against the brand and requires a ZIP code', () => {
    const amex = getCardTypeByValue('37');
    expect(getCVCError('')).toBe('Enter a CVC');
    expect(getCVCError('12')).toBe('CVC is invalid');
    expect(getCVCError('123')).toBeUndefined();
    expect(getCVCError('123', undefined, { cardType: amex })).toBe('CVC is invalid');
    expect(getCVCError('1234', undefined, { cardType: amex })).toBeUndefined();
    expect(getZIPError('')).toBe('Enter a ZIP code');
    expect(getZIPError('90210')).toBeUndefined();
  });
});
