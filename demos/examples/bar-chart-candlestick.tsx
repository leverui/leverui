import { type JSX } from '@solidjs/web';
import { BarChart, type BarDatum } from '../../src';

/** Daily open/close bodies and high/low wicks. */
const prices: readonly BarDatum[] = [
  { date: '2024-01-01', open_close: [185.96, 185.64], high_low: [186.74, 185.19] },
  { date: '2024-01-02', open_close: [184.22, 185.14], high_low: [185.15, 182.73] },
  { date: '2024-01-03', open_close: [184.22, 181.42], high_low: [184.26, 181.12] },
  { date: '2024-01-04', open_close: [181.99, 182.68], high_low: [183.0872, 181.59] },
  { date: '2024-01-05', open_close: [182.15, 185.56], high_low: [185.66, 181.5] },
  { date: '2024-01-08', open_close: [184.51, 185.8], high_low: [186.01, 183.98] },
  { date: '2024-01-09', open_close: [186.19, 185.64], high_low: [187.05, 184.74] },
  { date: '2024-01-10', open_close: [186.09, 186.19], high_low: [187.3499, 185.36] },
  { date: '2024-01-11', open_close: [186.54, 185.59], high_low: [187.05, 185.08] },
  { date: '2024-01-12', open_close: [185.34, 185.92], high_low: [186.565, 184.455] },
];

/** Turn an ISO date into the abbreviated day label, read in UTC so the day never shifts. */
function shortDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(value));
}

/** Keep a single decimal place on the right-side price axis. */
function priceTick(value: number): string {
  return value.toFixed(1);
}

/** Render opening/closing bodies with colored direction and high/low stems. */
export function BarChartCandlestick(): JSX.Element {
  return (
    <BarChart
      data={prices}
      xKey="date"
      series={[
        {
          name: 'open_close',
          color: 'teal.solid',
          wickKey: 'high_low',
          colorByDirection: { up: 'green.solid', down: 'red.solid' },
        },
      ]}
      xTickFormatter={shortDate}
      yTickFormatter={priceTick}
      yDomain={[181, 187.5]}
      yTickValues={[181, 183, 185, 187]}
      yAxisPlacement="right"
      verticalGrid
      barSize={40}
      maxHeight={448}
    />
  );
}
