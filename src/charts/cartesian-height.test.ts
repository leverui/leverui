import { expect, test } from 'vitest';
import { cartesianSvgHeight } from './cartesian-height';

/** Keep the landscape ratio until its small-frame cap. */
function verifiesResponsiveHeight(): void {
  expect(cartesianSvgHeight(280, {})).toBe(210);
  expect(cartesianSvgHeight(700, {})).toBe(384);
  expect(cartesianSvgHeight(280, { showLegend: true })).toBe(182);
  expect(cartesianSvgHeight(700, { showLegend: true })).toBe(356);
  expect(cartesianSvgHeight(700, { showLegend: true, legendPlacement: 'top-right' })).toBe(384);
  expect(cartesianSvgHeight(700, { maxHeight: 448 })).toBe(448);
  expect(cartesianSvgHeight(280, { maxHeight: 448 })).toBe(210);
  expect(cartesianSvgHeight(280, { height: 260, maxHeight: 448 })).toBe(260);
  expect(() => cartesianSvgHeight(280, { maxHeight: 0 })).toThrow(/maxHeight/);
  expect(() => cartesianSvgHeight(280, { maxHeight: Number.NaN })).toThrow(/maxHeight/);
}

test(
  'Cartesian charts cap responsive height while preserving explicit height',
  verifiesResponsiveHeight,
);
