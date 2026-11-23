import { expect, test } from 'vitest';
import { sizeCssValue } from './size-css-value';
import { spacingCssValue } from './spacing-css-value';

/** Keep a missing zero token usable as a real CSS gap. */
function verifiesZeroSpacing(): void {
  expect(spacingCssValue('0')).toBe('var(--lui-spacing-0, 0)');
  expect(spacingCssValue(0)).toBe('var(--lui-spacing-0, 0)');
}

/** Preserve custom token overrides and native CSS lengths. */
function verifiesSpacingValues(): void {
  expect(spacingCssValue('2')).toBe('var(--lui-spacing-2)');
  expect(spacingCssValue('0.5')).toBe('var(--lui-spacing-0\\.5)');
  expect(spacingCssValue('xs')).toBe('var(--lui-spacing-xs)');
  expect(spacingCssValue('12px')).toBe('12px');
  expect(spacingCssValue('normal')).toBe('normal');
}

/** Resolve custom token names that start with a digit. */
function verifiesDigitLeadingTokens(): void {
  expect(spacingCssValue('2xs')).toBe('var(--lui-spacing-2xs)');
  expect(spacingCssValue('2xl')).toBe('var(--lui-spacing-2xl)');
  expect(spacingCssValue('3xl')).toBe('var(--lui-spacing-3xl)');
}

/** Never read a CSS length as a token name, whatever its unit or case. */
function verifiesLengthsStayRaw(): void {
  for (const length of ['2px', '2rem', '2em', '2cap', '1ic', '2rex', '5svmin', '5dvmax', '10PX']) {
    expect(spacingCssValue(length)).toBe(length);
    expect(sizeCssValue(length)).toBe(length);
  }
}

test('zero spacing resolves when its token is absent', verifiesZeroSpacing);
test('spacing preserves token overrides and native lengths', verifiesSpacingValues);
test('spacing resolves token names that start with a digit', verifiesDigitLeadingTokens);
test('spacing and size keep every CSS length raw', verifiesLengthsStayRaw);
