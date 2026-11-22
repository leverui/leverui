import { type JSX } from '@solidjs/web';
import { BarChart, type BarDatum } from '../../src';

/** Frequencies for the contiguous ten-unit bins. */
const frequencies = [
  0, 10, 30, 50, 100, 200, 120, 220, 300, 320, 400, 470, 570, 810, 720, 810, 750, 810, 700, 530,
  380, 410, 250, 170, 120, 100, 90, 120, 70, 55, 40, 20, 0,
] as const;

/** Pair each frequency with the lower and upper bounds of its bin. */
const bins: readonly BarDatum[] = frequencies.map(
  /** Preserve the 0–330 range in ten-unit increments. */
  (value, index) => ({ from: index * 10, to: (index + 1) * 10, value }),
);

/** Describe the hovered histogram bin with both interval endpoints. */
function rangeLabel(row: BarDatum): string {
  return `Range: ${row.from}-${row.to}`;
}

/** Render the histogram with contiguous bars and labeled axes. */
export function BarChartHistogram(): JSX.Element {
  return (
    <BarChart
      data={bins}
      xKey="from"
      series={[{ name: 'value', color: 'teal.solid' }]}
      yDomain={[0, 1000]}
      yTickValues={[0, 250, 500, 750, 1000]}
      xTickEvery={3}
      xAxisLabel="Value range"
      yAxisLabel="Frequency"
      tooltipLabelFormatter={rangeLabel}
      gridDashed
      verticalGrid
      showAxisLines
      tooltip
      topInset={20}
      bottomInset={50}
      leftInset={100}
      rightInset={20}
    />
  );
}
