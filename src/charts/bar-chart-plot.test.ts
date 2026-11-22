import { expect, it } from 'vitest';
import { barChartPlot } from './bar-chart-plot';
import type { BarChartProps } from './bar-chart-types';

const chart: BarChartProps = {
  data: [{ category: 'A', value: 20 }],
  xKey: 'category',
  series: [{ name: 'value', color: 'teal.solid' }],
};

/** Keep the landscape ratio until its small-height cap. */
function verifiesResponsiveDefault(): void {
  expect(barChartPlot(chart, 320).height).toBe(240);
  expect(barChartPlot(chart, 700).height).toBe(384);
  expect(barChartPlot({ ...chart, maxHeight: 448 }, 320).height).toBe(240);
  expect(barChartPlot({ ...chart, maxHeight: 448 }, 700).height).toBe(448);
  expect(barChartPlot({ ...chart, height: 448 }, 320).height).toBe(448);
  expect(barChartPlot({ ...chart, height: 500, maxHeight: 448 }, 320).height).toBe(500);
}

it('uses a capped 4:3 frame while preserving explicit heights', verifiesResponsiveDefault);

/** Reserve top-right legend space only while that legend is visible. */
function verifiesOptionalLegendInset(): void {
  expect(barChartPlot({ ...chart, legendPlacement: 'top-right' }, 700).right).toBe(6);
  expect(
    barChartPlot({ ...chart, showLegend: true, legendPlacement: 'top-right' }, 700).right,
  ).toBe(100);
  expect(barChartPlot({ ...chart, yAxisPlacement: 'right' }, 700).right).toBe(65);
}

it('reserves side space only for a visible top-right legend', verifiesOptionalLegendInset);
