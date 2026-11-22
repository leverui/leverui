import { describe, expect, it } from 'vitest';
import { progressCircleAttributes } from './progress-circle-attributes';

/** Keep the default medium ring. */
function verifiesDefault(): void {
  expect(progressCircleAttributes({})['data-size']).toBe('md');
}

/** Keep responsive geometry and palette available to CSS. */
function verifiesResponsive(): void {
  expect(
    progressCircleAttributes({ size: ['sm', null, 'xl'], colorPalette: ' teal ', unstyled: true }),
  ).toMatchObject({
    'data-size': 'sm',
    'data-size-md': 'xl',
    'data-leverui-color-palette': 'teal',
    'data-unstyled': '',
  });
}

/** Reject appearance values outside the authored selectors. */
function verifiesInvalid(): void {
  expect(() => progressCircleAttributes({ size: 'huge' as never })).toThrow('Progress Circle size');
  expect(() => progressCircleAttributes({ colorPalette: ' ' })).toThrow(
    'Progress Circle colorPalette',
  );
}

describe('Progress Circle CSS attributes', () => {
  it('keeps the default size', verifiesDefault);
  it('reflects responsive and palette choices', verifiesResponsive);
  it('rejects unsupported values', verifiesInvalid);
});
