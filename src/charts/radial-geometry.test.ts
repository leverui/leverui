import { describe, expect, it } from 'vitest';
import { radialSectors, type RadialDatum } from './radial-geometry';

const data: readonly RadialDatum[] = [
  { name: 'first', value: 2, color: 'blue.solid' },
  { name: 'second', value: 1, color: 'pink.solid' },
];

describe('radialSectors', () => {
  it('allocates positive values without changing source data', () => {
    const before = structuredClone(data);
    const sectors = radialSectors(data, 100, 60, 100);
    expect(sectors).toHaveLength(2);
    expect(sectors[0]?.endAngle).toBe(240);
    expect(sectors[1]?.endAngle).toBe(360);
    expect(sectors[0]?.path).toContain('A 60 60');
    expect(data).toEqual(before);
  });

  it('supports reverse sweeps and ignores invalid values', () => {
    const sectors = radialSectors(
      [...data, { name: 'invalid', value: Number.NaN, color: 'red.solid' }],
      100,
      0,
      100,
      180,
      0,
    );
    expect(sectors).toHaveLength(2);
    expect(sectors[0]?.startAngle).toBe(180);
    expect(sectors[1]?.endAngle).toBe(0);
    expect(sectors[0]?.path).toContain('A 100 100');
  });

  it('draws a full circle when one value occupies the whole chart', () => {
    const sectors = radialSectors(data.slice(0, 1), 100, 60, 100);
    expect(sectors).toHaveLength(1);
    expect(sectors[0]?.path.match(/A 100 100/g)).toHaveLength(2);
  });
});
