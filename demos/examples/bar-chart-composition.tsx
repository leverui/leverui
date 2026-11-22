import { createMemo, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { BarChart, Card, SegmentGroup } from '../../src';
import { barMonthlyData } from './bar-chart-data';
import './card-compositions.css';

type CurrentKey = 'windows' | 'mac' | 'linux';

/** Series colors from the operating-system chart. */
const colors: Record<CurrentKey, string> = {
  windows: 'teal.solid',
  mac: 'purple.solid',
  linux: 'blue.solid',
};

const countFormatter = new Intl.NumberFormat('en-US');

/** Add the eight monthly values for one operating system. */
function total(name: CurrentKey): number {
  return barMonthlyData.reduce(
    /** Accumulate one category's value without changing the source rows. */
    (sum, row) => {
      const value = row[name];
      return sum + (typeof value === 'number' ? value : 0);
    },
    0,
  );
}

/** Render a compact chart whose selected operating system changes reactively. */
export function BarChartComposition(): JSX.Element {
  const [current, setCurrent] = createSignal<CurrentKey>('windows');
  const series = createMemo(
    /** Use the selected category's color and key for the only visible series. */
    () => [{ name: current(), color: colors[current()] }],
  );
  /** Store the selected operating-system name from the segment control. */
  function select(details: { value: string | null }): void {
    if (details.value === 'windows' || details.value === 'mac' || details.value === 'linux') {
      setCurrent(details.value);
    }
  }
  return (
    <Card.Root class="card-composition-bar-chart">
      <Card.Header class="card-composition-bar-header">
        <Card.Title>OS downloads</Card.Title>
        <SegmentGroup.Root size="xs" value={current()} onValueChange={select}>
          <SegmentGroup.Indicator />
          <SegmentGroup.Items
            items={[
              { value: 'windows', label: `Windows (${countFormatter.format(total('windows'))})` },
              { value: 'mac', label: `Mac (${countFormatter.format(total('mac'))})` },
              { value: 'linux', label: `Linux (${countFormatter.format(total('linux'))})` },
            ]}
          />
        </SegmentGroup.Root>
      </Card.Header>
      <Card.Body>
        <BarChart
          data={barMonthlyData}
          xKey="month"
          series={series()}
          xTickFormatter={shortMonth}
          showYAxis={false}
          showGrid={false}
          yDomain={[0, 200]}
          height={160}
          bottomInset={35}
        />
      </Card.Body>
    </Card.Root>
  );
}

/** Match the short month labels below the compact chart. */
function shortMonth(value: string): string {
  return value.slice(0, 3);
}
