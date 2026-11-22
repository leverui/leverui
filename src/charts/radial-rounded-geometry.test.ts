import { describe, expect, it } from 'vitest';
import { radialSectors, type RadialDatum } from './radial-geometry';
import { roundedRadialSectorPath } from './radial-rounded-geometry';

const data: readonly RadialDatum[] = [
  { name: 'windows', value: 400, color: 'blue.solid' },
  { name: 'mac', value: 300, color: 'orange.solid' },
  { name: 'linux', value: 300, color: 'pink.solid' },
];

/** Preserve a full first sector instead of splitting its padding. */
function checkPadding(): void {
  const sectors = radialSectors(data, 100, 80, 100, 0, 360, 8);
  expect(sectors[0]?.startAngle).toBe(0);
  expect(sectors[0]?.endAngle).toBeCloseTo(134.4);
  expect(sectors[1]?.startAngle).toBeCloseTo(142.4);
}

/** Match the first rounded corner and both ring edges. */
function checkRoundedEdges(): void {
  const path = roundedRadialSectorPath(100, 80, 100, 0, 134.4, 4);
  expect(path).toMatch(/^M 195\.9166/);
  expect(path).toContain('A 4 4 0 0 0 199.913');
  expect(path).toContain('A 100 100');
  expect(path).toContain('A 80 80');
}

/** Avoid a degenerate arc when one sector spans an entire circle. */
function checkFullRing(): void {
  const path = roundedRadialSectorPath(100, 80, 100, 0, 360, 4);
  expect(path.match(/A 100 100/g)).toHaveLength(2);
}

/** Group the rounded radial sector geometry regressions. */
function registerRoundedSectorTests(): void {
  it('starts at zero and inserts an eight-degree gap between values', checkPadding);
  it('keeps the circular edges at their requested radii', checkRoundedEdges);
  it('retains a full ring when no exposed corners exist', checkFullRing);
}

describe('rounded radial sectors', registerRoundedSectorTests);
