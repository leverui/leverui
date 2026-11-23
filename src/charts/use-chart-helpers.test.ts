import { createRoot, flush } from 'solid-js';
import { expect, it } from 'vitest';
import { useChart } from './use-chart';
import { chartColorToken, chartSizeToken, chartSpacingToken } from './use-chart-tokens';

const revenue = [
  { date: '2024-01-03', revenue: 3000, region: 'west' },
  { date: '2024-01-01', revenue: 1000, region: 'east' },
  { date: '2024-01-02', revenue: 2000, region: 'west' },
];

/** Aggregate, sort text keys, group, and compute domain percentages. */
function checksAggregation(): void {
  createRoot(
    /** Own the chart model for these assertions. */
    (dispose) => {
      const chart = useChart({
        data: revenue,
        sort: { by: 'date', direction: 'asc' },
        series: [{ name: 'revenue', color: 'blue.500' }],
      });
      expect(chart.data.map((item) => item.date)).toEqual([
        '2024-01-01',
        '2024-01-02',
        '2024-01-03',
      ]);
      expect(chart.getKey('revenue')).toBe('revenue');
      expect(chart.getMin('revenue')).toBe(1000);
      expect(chart.getMax('revenue')).toBe(3000);
      expect(chart.getValuePercent('revenue', 3000)).toBe(50);
      expect(chart.getValuePercent('revenue', 2000, ({ min, max }) => [min, max])).toBe(50);
      expect(chart.groupBy('region').map((group) => group.length)).toEqual([1, 2]);
      expect(chart.getSeries('revenue')?.color).toBe('blue.500');
      expect(chart.id).toBeTruthy();
      dispose();
    },
  );
}

/** Format with the locale and track the highlighted series. */
function checksFormattingAndHighlight(): void {
  const { chart, dispose } = createRoot(
    /** Own the chart model for these assertions. */
    (dispose) => ({ chart: useChart({ data: revenue }), dispose }),
  );
  expect(chart.formatNumber({ style: 'currency', currency: 'USD' })(1000)).toBe('$1,000.00');
  expect(chart.formatDate({ year: 'numeric', month: 'short' })('2024-03-28')).toBe('Mar 2024');
  expect(chart.getSeriesOpacity('revenue')).toBeUndefined();
  // Solid 2 rejects writes inside an owner's body, so the highlight changes outside the root.
  chart.setHighlightedSeries('revenue');
  flush();
  expect(chart.isHighlightedSeries('revenue')).toBe(true);
  expect(chart.getSeriesOpacity('revenue')).toBe(1);
  expect(chart.getSeriesOpacity('other')).toBe(0.2);
  dispose();
}

/** Resolve token names to CSS variables and leave raw CSS values alone. */
function checksTokens(): void {
  expect(chartColorToken('blue.500')).toBe('var(--lui-colors-blue-500)');
  expect(chartColorToken('fg.muted')).toBe('var(--lui-colors-fg-muted)');
  expect(chartColorToken('colorPalette.focusRing')).toBe(
    'var(--lui-colors-color-palette-focus-ring)',
  );
  expect(chartColorToken('fg')).toBe('var(--lui-colors-fg)');
  expect(chartColorToken('#ff0000')).toBe('#ff0000');
  expect(chartSizeToken('4')).toBe('var(--lui-sizes-4)');
  expect(chartSizeToken('sm')).toBe('var(--lui-sizes-sm)');
  expect(chartSizeToken('20px')).toBe('20px');
  expect(chartSpacingToken('1.5')).toBe('var(--lui-spacing-1\\.5)');
  expect(chartSpacingToken('2rem')).toBe('2rem');
}

it('aggregates, sorts, groups, and finds series', checksAggregation);
it('formats values and tracks the highlighted series', checksFormattingAndHighlight);
it('resolves design tokens to CSS variables', checksTokens);
