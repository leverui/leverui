import { describe, expect, it } from 'vitest';
import { radarMaximum, radarPath, radarPoint, radarSeriesPoints } from './radar-geometry';

describe('radar geometry', () => {
  it('places five categories clockwise and closes their outline', () => {
    const top = radarPoint(100, 100, 40, 0, 5);
    const second = radarPoint(100, 100, 40, 1, 5);
    expect(top.x).toBeCloseTo(100);
    expect(top.y).toBeCloseTo(60);
    expect(second.x).toBeGreaterThan(100);
    expect(radarPath([top, second])).toBe('');
    expect(radarPath([top, second, radarPoint(100, 100, 40, 2, 5)])).toMatch(/ Z$/);
  });

  it('uses one domain for multiple series without changing source values', () => {
    const data = Object.freeze([
      Object.freeze({ label: 'January', windows: 110, mac: 160 }),
      Object.freeze({ label: 'February', windows: Number.NaN, mac: 20 }),
      Object.freeze({ label: 'March', windows: -5, mac: 80 }),
    ]);
    expect(radarMaximum(data, ['windows', 'mac'])).toBe(160);
    expect(radarMaximum([{ label: 'January', windows: 130 }], ['windows'])).toBe(140);
    const points = radarSeriesPoints(data, 'windows', 100, 100, 80, 160);
    expect(points[0]?.y).toBeCloseTo(45);
    expect(points[1]).toEqual({ x: 100, y: 100 });
    expect(points[2]).toEqual({ x: 100, y: 100 });
    expect(data[0]?.windows).toBe(110);
  });
});
