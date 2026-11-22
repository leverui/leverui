import { describe, expect, it } from 'vitest';
import { chartCurvePath } from './cartesian-curves';
import {
  cartesianPlot,
  chartAreaPath,
  chartDomain,
  chartSegments,
  chartStackedAreaSegments,
  chartSeriesPoints,
} from './cartesian-geometry';
import type { CartesianDatum, CartesianSeries } from './cartesian-types';

const data: readonly CartesianDatum[] = [
  { month: 'January', first: 20, second: 30 },
  { month: 'February', first: null, second: 40 },
  { month: 'March', first: 10, second: 50 },
];
const series: readonly CartesianSeries[] = [
  { name: 'first', color: 'teal.solid' },
  { name: 'second', color: 'blue.solid' },
];

describe('Cartesian chart geometry', () => {
  it('scales stacked percentages against each row total', () => {
    const plot = cartesianPlot(700, 256, chartDomain(data, series, true, true), true);
    const first = chartSeriesPoints(data, series, 0, plot, true, true);
    const second = chartSeriesPoints(data, series, 1, plot, true, true);
    expect(first[0]?.value).toBe(20);
    expect(first[0]?.baseY).toBe(plot.height - plot.bottom);
    expect(second[0]?.baseY).toBe(first[0]?.y);
    expect(second[0]?.y).toBe(plot.top);
  });

  it('preserves missing-value gaps unless connection is requested', () => {
    const plot = cartesianPlot(700, 256, chartDomain(data, series, false, false), false);
    const points = chartSeriesPoints(data, series, 0, plot, false, false);
    expect(chartSegments(points, false)).toHaveLength(2);
    expect(chartSegments(points, true)).toHaveLength(1);
    expect(chartAreaPath(chartSegments(points, true)[0] ?? [], 'linear')).toContain('Z');
  });

  it('drops outside gaps and places connected stacked area gaps at the baseline', () => {
    const plot = cartesianPlot(700, 256, { min: 0, max: 30 }, false);
    const edged = [{ first: null }, ...data, { first: null }];
    const points = chartSeriesPoints(edged, series, 0, plot, true, false);
    const connected = chartStackedAreaSegments(points);
    expect(connected).toHaveLength(1);
    expect(
      connected[0]?.map(
        /** Read the gap policy without relying on SVG path syntax. */
        (point) => point.value,
      ),
    ).toEqual([20, 0, 10]);
    expect(connected[0]?.[1]?.value).toBe(0);
    expect(connected[0]?.[1]?.y).toBe(connected[0]?.[1]?.baseY);
  });

  it('includes negative values in the independent domain', () => {
    const signed: readonly CartesianDatum[] = [{ value: -20 }, { value: 40 }];
    const domain = chartDomain(signed, [{ name: 'value', color: 'teal.solid' }], false, false);
    expect(domain.min).toBeLessThanOrEqual(-20);
    expect(domain.max).toBeGreaterThanOrEqual(40);
  });

  it('keeps all eight curve types visually distinct', () => {
    const points = [
      { x: 0, y: 20 },
      { x: 10, y: 5 },
      { x: 20, y: 15 },
      { x: 30, y: 0 },
    ];
    const curves = [
      'linear',
      'bump',
      'basis',
      'step',
      'stepBefore',
      'stepAfter',
      'natural',
      'monotone',
    ] as const;
    const paths = curves.map(
      /** Trace the same points with each supported interpolation. */
      (curve) => chartCurvePath(points, curve),
    );
    expect(new Set(paths).size).toBe(curves.length);
  });

  it('rejects an invalid numeric domain before drawing SVG coordinates', () => {
    expect(() => cartesianPlot(700, 354, { min: 1, max: 1 }, false)).toThrow(/domain/);
    expect(() => cartesianPlot(700, 354, { min: 0, max: Number.NaN }, false)).toThrow(/domain/);
  });

  it('applies explicit plot margins and rejects invalid insets', () => {
    const margin = { left: 40, right: 40, top: 40 };
    const plot = cartesianPlot(
      280,
      210,
      { min: 0, max: 400 },
      false,
      undefined,
      undefined,
      undefined,
      4,
      margin,
    );
    expect(plot).toMatchObject({ left: 40, right: 40, top: 40, bottom: 34 });
    expect(() =>
      cartesianPlot(280, 210, { min: 0, max: 400 }, false, undefined, undefined, undefined, 4, {
        left: -1,
      }),
    ).toThrow(/plotMargin/);
    expect(() =>
      cartesianPlot(280, 210, { min: 0, max: 400 }, false, undefined, undefined, undefined, 4, {
        top: Number.NaN,
      }),
    ).toThrow(/plotMargin/);
  });
});
