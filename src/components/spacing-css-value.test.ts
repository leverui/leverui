import { expect, test } from 'vitest';
import { spacingCssValue } from './spacing-css-value';

/** Keep a missing zero token usable as a real CSS gap. */
function verifiesZeroSpacing(): void {
  expect(spacingCssValue('0')).toBe('var(--lui-spacing-0, 0)');
  expect(spacingCssValue(0)).toBe('var(--lui-spacing-0, 0)');
}

/** Preserve custom token overrides and native CSS lengths. */
function verifiesSpacingValues(): void {
  expect(spacingCssValue('2')).toBe('var(--lui-spacing-2)');
  expect(spacingCssValue('12px')).toBe('12px');
}

test('zero spacing resolves when its token is absent', verifiesZeroSpacing);
test('spacing preserves token overrides and native lengths', verifiesSpacingValues);
