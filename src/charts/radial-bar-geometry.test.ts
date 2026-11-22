import { describe, expect, it } from 'vitest';
import { radialBarEntries, type RadialBarDatum } from './radial-bar-geometry';

const data: readonly RadialBarDatum[] = [
  { name: 'January', value: 165, color: 'teal.solid' },
  { name: 'February', value: 195, color: 'purple.solid' },
];

describe('radial bar geometry', () => {
  it('keeps every value on its own concentric track', () => {
    const entries = radialBarEntries(data, 160, 5, 20, 7);
    expect(entries).toHaveLength(2);
    expect(entries[0]?.radius).toBe(15);
    expect(entries[1]?.radius).toBe(42);
    expect(entries[0]?.foreground).not.toBe(entries[0]?.background);
    expect(entries[1]?.foreground).toBe(entries[1]?.background);
  });

  it('does not change caller data and excludes invalid values', () => {
    const source = [...data, { name: 'Invalid', value: Number.NaN, color: 'blue.solid' }];
    expect(radialBarEntries(source, 160, 5, 20, 7, 195)).toHaveLength(2);
    expect(source[0]).toEqual(data[0]);
    expect(source[2]?.name).toBe('Invalid');
  });
});
