import { describe, expect, it } from 'vitest';
import { progressAttributes } from './progress-attributes';

/** Preserve the defaults in stable native attributes. */
function verifiesDefaults(): void {
  expect(progressAttributes({})).toMatchObject({
    'data-size': 'md',
    'data-variant': 'outline',
    'data-shape': 'rounded',
    'data-striped': 'false',
    'data-animated': 'false',
  });
}

/** Keep responsive choices and explicit false states available to CSS. */
function verifiesResponsiveChoices(): void {
  expect(
    progressAttributes({
      size: { base: 'sm', md: 'xl' },
      shape: ['square', null, 'full'],
      striped: { base: true, md: false },
      animated: true,
      colorPalette: ' teal ',
      unstyled: true,
    }),
  ).toMatchObject({
    'data-size': 'sm',
    'data-size-md': 'xl',
    'data-shape': 'square',
    'data-shape-md': 'full',
    'data-striped': 'true',
    'data-striped-md': 'false',
    'data-animated': 'true',
    'data-lui-color-palette': 'teal',
    'data-unstyled': '',
  });
}

/** Reject choices that authored CSS cannot represent. */
function verifiesInvalidChoices(): void {
  expect(() => progressAttributes({ size: 'huge' as never })).toThrow('Progress size');
  expect(() => progressAttributes({ striped: { hover: true } as never })).toThrow(
    'Progress striped',
  );
  expect(() => progressAttributes({ colorPalette: ' ' })).toThrow('Progress colorPalette');
}

describe('Progress CSS choice attributes', () => {
  it('keeps the default treatment', verifiesDefaults);
  it('reflects responsive and palette choices', verifiesResponsiveChoices);
  it('rejects unsupported values', verifiesInvalidChoices);
});
