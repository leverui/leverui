import { expect, it } from 'vitest';
import {
  hasBreakpointOverride,
  isAdditiveBooleanSelection,
  readResponsiveBooleans,
  readResponsiveStrings,
} from './responsive-values';

/** Preserve scalar, object, and array selections at their source breakpoints. */
function verifiesSupportedValues(): void {
  expect(readResponsiveStrings('horizontal')).toEqual({ base: 'horizontal' });
  expect(readResponsiveStrings({ base: 'horizontal', md: 'vertical' })).toEqual({
    base: 'horizontal',
    md: 'vertical',
  });
  expect(readResponsiveStrings(['horizontal', null, 'vertical'])).toEqual({
    base: 'horizontal',
    md: 'vertical',
  });
  expect(readResponsiveBooleans({ base: false, md: true })).toEqual({ base: false, md: true });
}

it('reads ordinary breakpoint selections', verifiesSupportedValues);

/** Leave range conditions and nested values on their existing runtime path. */
function verifiesFallbackValues(): void {
  expect(readResponsiveStrings({ mdDown: 'horizontal', md: 'vertical' })).toBeUndefined();
  expect(readResponsiveStrings({ md: { _dark: 'vertical' } })).toBeUndefined();
  expect(readResponsiveBooleans([true, null, false, null, null, null, true])).toBeUndefined();
  expect(readResponsiveStrings({ base: 'horizontal', md: undefined })).toEqual({
    base: 'horizontal',
  });
}

it('rejects selections needing another selector contract', verifiesFallbackValues);

/** Use CSS only when growth never needs a later reset and edges stay stable. */
function verifiesLayoutEligibility(): void {
  expect(isAdditiveBooleanSelection({ base: false, md: true })).toBe(true);
  expect(isAdditiveBooleanSelection({ base: true, md: false })).toBe(false);
  expect(hasBreakpointOverride({ base: 'horizontal', md: 'vertical' })).toBe(true);
  expect(hasBreakpointOverride({ base: 'horizontal' })).toBe(false);
}

it('recognizes additive group selections', verifiesLayoutEligibility);
