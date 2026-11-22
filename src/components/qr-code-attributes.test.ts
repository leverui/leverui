import { describe, expect, it } from 'vitest';
import { qrCodeAttributes } from './qr-code-attributes';

/** Keep the default medium QR size. */
function verifiesDefault(): void {
  expect(qrCodeAttributes({})['data-size']).toBe('md');
}

/** Keep responsive size choices available to authored CSS. */
function verifiesResponsive(): void {
  expect(qrCodeAttributes({ size: ['xs', null, 'xl'], unstyled: true })).toMatchObject({
    'data-size': 'xs',
    'data-size-md': 'xl',
    'data-unstyled': '',
  });
}

/** Reject size values that have no authored selector. */
function verifiesInvalid(): void {
  expect(() => qrCodeAttributes({ size: 'huge' as never })).toThrow('QR Code size');
}

describe('QR Code CSS attributes', () => {
  it('keeps the default size', verifiesDefault);
  it('reflects responsive choices', verifiesResponsive);
  it('rejects unsupported sizes', verifiesInvalid);
});
