import { describe, expect, it } from 'vitest';
import { barMaximum, barPath, barRect, barValue } from './bar-geometry';
import type { BarChartProps } from './bar-chart-types';
import type { CartesianPlot } from './cartesian-types';

/** Stable plot bounds for comparing grouped and stacked bars. */
const plot: CartesianPlot = {
  width: 500,
  height: 384,
  left: 65,
  right: 5,
  top: 5,
  bottom: 35,
  min: 0,
  max: 100,
};

describe('bar geometry', () => {
  it('places grouped series side by side without mutating category rows', () => {
    const data = Object.freeze([Object.freeze({ type: 'Stock', first: 60, second: 45 })]);
    const chart: BarChartProps = {
      data,
      xKey: 'type',
      series: [
        { name: 'first', color: 'teal.solid' },
        { name: 'second', color: 'blue.solid' },
      ],
    };
    const first = barRect(chart, plot, 0, 0);
    const second = barRect(chart, plot, 0, 1);
    if (!first || !second) throw new Error('Expected two visible grouped bars.');
    expect(first.x + first.width).toBeLessThan(second.x);
    expect(first.height).toBeGreaterThan(second.height);
    expect(data[0]?.first).toBe(60);
  });

  it('shares a stack slot and normalizes percentages from source values', () => {
    const chart: BarChartProps = {
      data: [{ type: 'January', windows: 60, mac: 40 }],
      xKey: 'type',
      series: [
        { name: 'windows', color: 'teal.solid', stackId: 'a' },
        { name: 'mac', color: 'purple.solid', stackId: 'a' },
      ],
    };
    expect(barMaximum(chart.data, chart.series)).toBe(100);
    const first = barRect(chart, plot, 0, 0);
    const second = barRect(chart, plot, 0, 1);
    if (!first || !second) throw new Error('Expected two visible stacked bars.');
    expect(first.x).toBe(second.x);
    expect(second.y + second.height).toBeCloseTo(first.y);
    const percent = { ...chart, percent: true };
    const fractionPlot = { ...plot, max: 1 };
    expect(barRect(percent, fractionPlot, 0, 0)?.height).toBeCloseTo(first.height);
    expect(barValue({ value: Number.NaN }, 'value')).toBe(0);
  });

  it('places signed bars around zero and floats range bars above their lower bound', () => {
    const signedPlot = { ...plot, min: -400, max: 400 };
    const signed: BarChartProps = {
      data: [{ name: 'Loss', value: -300 }],
      xKey: 'name',
      series: [{ name: 'value', color: 'red.solid' }],
    };
    const loss = barRect(signed, signedPlot, 0, 0);
    if (!loss) throw new Error('Expected a signed bar.');
    expect(loss.y).toBeCloseTo(177);
    expect(loss.height).toBeCloseTo(129);
    const ranged = { ...signed, data: [{ name: 'UK', value: [10, 20] as const }] };
    const interval = barRect(ranged, plot, 0, 0);
    if (!interval) throw new Error('Expected a floating range bar.');
    expect(interval.y).toBeCloseTo(280.2);
    expect(interval.height).toBeCloseTo(34.4);
    expect(barMaximum(ranged.data, ranged.series)).toBe(20);
    expect(barPath(loss, 4).match(/Q/g)).toHaveLength(4);
  });

  it('shares a row band while stacking horizontal segments end to end', () => {
    const chart: BarChartProps = {
      data: [{ month: 'January', windows: 186, mac: 80 }],
      xKey: 'month',
      orientation: 'horizontal',
      series: [
        { name: 'windows', color: 'teal.solid', stackId: 'os' },
        { name: 'mac', color: 'purple.solid', stackId: 'os' },
      ],
    };
    const horizontalPlot = { ...plot, max: 600 };
    const windows = barRect(chart, horizontalPlot, 0, 0);
    const mac = barRect(chart, horizontalPlot, 0, 1);
    if (!windows || !mac) throw new Error('Expected two horizontal stack segments.');
    expect(windows.y).toBe(mac.y);
    expect(windows.x + windows.width).toBeCloseTo(mac.x);
    expect(mac.width).toBeCloseTo((80 / 600) * 430);
  });

  it('keeps positive and negative series on separate sides of a shared stack', () => {
    const chart: BarChartProps = {
      data: [{ month: 'January', gain: 60, loss: -20, more: 40 }],
      xKey: 'month',
      series: [
        { name: 'gain', color: 'green.solid', stackId: 'a' },
        { name: 'loss', color: 'red.solid', stackId: 'a' },
        { name: 'more', color: 'green.solid', stackId: 'a' },
      ],
    };
    const signedPlot = { ...plot, min: -50, max: 100 };
    const gain = barRect(chart, signedPlot, 0, 0);
    const loss = barRect(chart, signedPlot, 0, 1);
    const more = barRect(chart, signedPlot, 0, 2);
    if (!gain || !loss || !more) throw new Error('Expected each signed stack segment.');
    expect(barMaximum(chart.data, chart.series)).toBe(100);
    expect(gain.y + gain.height).toBeCloseTo(loss.y);
    expect(more.y + more.height).toBeCloseTo(gain.y);
  });
});
