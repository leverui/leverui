import { describe, expect, it } from 'vitest';
import { scatterMaximum, scatterTrend, scatterXDomain } from './scatter-geometry';

describe('scatter geometry', () => {
  it('uses finite points to derive bounded numeric axes', () => {
    const data = Object.freeze([
      Object.freeze({ temperature: 14.2, sales: 215 }),
      Object.freeze({ temperature: 25.1, sales: 614 }),
      Object.freeze({ temperature: Number.NaN, sales: Number.POSITIVE_INFINITY }),
    ]);
    expect(scatterXDomain(data, 'temperature')).toEqual([14.2, 25.1]);
    expect(scatterMaximum(data, 'sales')).toBe(800);
    expect(data[0]?.temperature).toBe(14.2);
  });

  it('fits a line through valid coordinates and handles vertical samples', () => {
    expect(
      scatterTrend(
        [
          { x: 1, y: 2 },
          { x: 2, y: 4 },
          { x: 3, y: 6 },
        ],
        'x',
        'y',
      ),
    ).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 6 },
    ]);
    expect(
      scatterTrend(
        [
          { x: 1, y: 2 },
          { x: 1, y: 4 },
        ],
        'x',
        'y',
      ),
    ).toBeNull();
  });
});
