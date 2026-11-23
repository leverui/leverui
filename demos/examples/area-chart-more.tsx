import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { AreaChart, Box, Heading, SimpleGrid, Stack, Text } from '../../src';
import type { CartesianCurve } from '../../src/charts/cartesian-chart';
import './area-chart-more.css';
import {
  labeledSales,
  monthlyData,
  monthlySeries,
  salesMonthTicks,
  shortMonth,
  sparseSales,
} from './area-chart-data';

/** Fade each stacked series toward the category axis. */
export function AreaChartGradient(): JSX.Element {
  const series = monthlySeries.map(
    /** Widen gradient series strokes. */
    (item) => ({ ...item, strokeWidth: 2 }),
  );
  return (
    <AreaChart
      data={monthlyData}
      series={series}
      xKey="month"
      stacked
      gradient
      curve="natural"
      showGrid
      gridDashed
      showYAxis
      showLegend
      xTickFormatter={shortMonth}
      aria-label="Monthly operating system counts with gradients"
    />
  );
}

/** Compare gaps from nulls with a connected line. */
export function AreaChartNulls(): JSX.Element {
  return (
    <SimpleGrid minChildWidth="400px" style={{ gap: 'var(--lui-spacing-10)' }}>
      <For each={[false, true]}>
        {/** Render one null-handling policy with the same sales values. */}
        {(connectNulls) => (
          <Box>
            <Heading size="md" class="area-chart-null-heading">
              {`<Area connectNulls={${connectNulls}} />`}
            </Heading>
            <AreaChart
              data={sparseSales}
              series={[{ name: 'sales', color: 'teal.solid' }]}
              xKey="month"
              stacked
              connectNulls={connectNulls}
              showGrid
              xTickValues={salesMonthTicks}
              yDomain={[0, 300]}
              xTickFormatter={shortMonth}
              aria-label={`Sales with connectNulls ${connectNulls}`}
            />
          </Box>
        )}
      </For>
    </SimpleGrid>
  );
}

/** Label the numeric value at every sales point. */
export function AreaChartPointLabel(): JSX.Element {
  return (
    <AreaChart
      data={labeledSales}
      series={[{ name: 'sales', color: 'teal.solid' }]}
      xKey="month"
      showGrid
      showLegend
      dots
      pointLabels
      xTickValues={salesMonthTicks}
      yDomain={[0, 300]}
      xTickFormatter={shortMonth}
      aria-label="Sales with point labels"
    />
  );
}

/** Highlight the February through June interval in red. */
export function AreaChartReferenceArea(): JSX.Element {
  return (
    <AreaChart
      data={monthlyData}
      series={monthlySeries}
      xKey="month"
      stacked
      showGrid
      showYAxis
      showLegend
      xTickValues={['February', 'June']}
      xTickFormatter={shortMonth}
      referenceLines={[{ x: 'February' }, { x: 'June' }]}
      referenceArea={{ x1: 'February', x2: 'June', label: "Feb - June '24", color: 'red.solid' }}
      aria-label="Monthly counts with a highlighted interval"
    />
  );
}

/** Mark August as the summer sale guide. */
export function AreaChartReferenceLines(): JSX.Element {
  return (
    <AreaChart
      data={monthlyData}
      series={monthlySeries}
      xKey="month"
      stacked
      showGrid
      showYAxis
      showLegend
      xTickFormatter={shortMonth}
      referenceLines={[{ x: 'August', label: 'Summer sale' }]}
      aria-label="Monthly counts with a reference line"
    />
  );
}

const curveTypes: readonly CartesianCurve[] = [
  'linear',
  'bump',
  'basis',
  'step',
  'stepBefore',
  'stepAfter',
  'natural',
  'monotone',
];

/** Compare the eight curve interpolation modes. */
export function AreaChartTypes(): JSX.Element {
  const series = monthlySeries.map(
    /** Use the white separators in the curve gallery. */
    (item) => ({ ...item, stroke: 'white', strokeWidth: 3 }),
  );
  return (
    <SimpleGrid minChildWidth="400px" style={{ gap: 'var(--lui-spacing-10)' }}>
      <For each={curveTypes}>
        {/** Label and draw one curve mode in a separate chart. */}
        {(curve) => (
          <Stack gap="4">
            <Text
              textStyle="sm"
              style={{
                'font-weight': 'var(--lui-font-weights-semibold)',
                'margin-inline-start': 'var(--lui-spacing-8)',
              }}
            >{`<Area type="${curve}" />`}</Text>
            <AreaChart
              data={monthlyData}
              series={series}
              xKey="month"
              stacked
              curve={curve}
              fillOpacity={0.8}
              showGrid
              showYAxis
              xTickFormatter={shortMonth}
              tooltip={false}
              aria-label={`${curve} monthly area chart`}
            />
          </Stack>
        )}
      </For>
    </SimpleGrid>
  );
}

/** Show both category and value axes beside a naturally curved stack. */
export function AreaChartValueAxis(): JSX.Element {
  const series = [
    monthlySeries[0],
    monthlySeries[1],
    { name: 'linux', color: 'orange.solid' },
  ].filter(
    /** Omit absent source entries while retaining series order. */
    (item): item is NonNullable<typeof item> => item !== undefined,
  );
  return (
    <AreaChart
      data={monthlyData}
      series={series}
      xKey="month"
      stacked
      curve="natural"
      showGrid={false}
      showYAxis
      xTickFormatter={shortMonth}
      aria-label="Monthly operating system values with both axes"
    />
  );
}
