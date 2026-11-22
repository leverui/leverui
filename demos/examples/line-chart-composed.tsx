import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Card, HStack, LineChart, SimpleGrid, Stack, Stat, Text } from '../../src';
import type {
  CartesianCurve,
  CartesianDatum,
  CartesianSeries,
} from '../../src/charts/cartesian-types';
import { monthlyData, multipleData, multipleDomain, shortMonth } from './line-chart-data';
import './card-compositions.css';

/** Customer acquisition counts by channel for the card. */
const channelData: readonly CartesianDatum[] = [
  { facebookAds: 20, organic: 20, googleAds: 45, month: 'January' },
  { facebookAds: 35, organic: 92, googleAds: 52, month: 'February' },
  { facebookAds: 48, organic: 78, googleAds: 20, month: 'March' },
  { facebookAds: 65, organic: 82, googleAds: 75, month: 'May' },
  { facebookAds: 72, organic: 95, googleAds: 40, month: 'June' },
  { facebookAds: 85, organic: 20, googleAds: 95, month: 'August' },
];

/** Three line and statistic labels in the card. */
const channelSeries: readonly CartesianSeries[] = [
  { name: 'facebookAds', label: 'Facebook Ads', color: 'blue.solid', strokeWidth: 2 },
  { name: 'organic', label: 'Organic', color: 'green.solid', strokeWidth: 2 },
  { name: 'googleAds', label: 'Google Ads', color: 'pink.solid', strokeWidth: 2 },
];

/** Sum finite values in one acquisition series without changing source rows. */
function channelTotal(name: string): number {
  return channelData.reduce(
    /** Add one valid channel sample to the displayed total. */
    (sum, row) => sum + (typeof row[name] === 'number' ? Number(row[name]) : 0),
    0,
  );
}

/** Pair a small three-series chart with the stat totals. */
export function LineChartComposition(): JSX.Element {
  return (
    <Card.Root class="card-composition-line-chart">
      <Card.Header>
        <Card.Title>Customers by channel</Card.Title>
      </Card.Header>
      <Card.Body>
        <LineChart
          data={channelData}
          series={channelSeries}
          xKey="month"
          maxHeight={128}
          xTickValues={['January', 'August']}
          xTickFormatter={shortMonth}
          tooltip={false}
          aria-label="Customers by acquisition channel"
        />
        <HStack wrap="wrap" gap="2">
          <For each={channelSeries}>
            {/** Describe each plotted acquisition channel and its total. */}
            {(series) => (
              <Stat.Root size="sm">
                <Stat.Label
                  style={{ 'font-size': 'var(--leverui-font-sizes-xs)', 'line-height': '1rem' }}
                >
                  <Box
                    style={{
                      width: 'var(--leverui-sizes-2)',
                      height: 'var(--leverui-sizes-2)',
                      background: series.color
                        ? `var(--leverui-colors-${series.color.replace('.', '-')})`
                        : undefined,
                      display: 'inline-block',
                      'margin-inline-end': 'var(--leverui-spacing-1)',
                    }}
                  />
                  {series.label}
                </Stat.Label>
                <Stat.ValueText style={{ 'font-weight': 'var(--leverui-font-weights-medium)' }}>
                  {channelTotal(series.name)}
                </Stat.ValueText>
              </Stat.Root>
            )}
          </For>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}

/** Use descriptive legend labels while retaining the original data keys. */
export function LineChartSeriesLabel(): JSX.Element {
  return (
    <LineChart
      data={multipleData}
      series={[
        { name: 'mac', label: 'Mac sales', color: 'purple.solid', strokeWidth: 2 },
        { name: 'linux', label: 'Linux sales', color: 'blue.solid', strokeWidth: 2 },
      ]}
      xKey="month"
      showYAxis
      showLegend
      legendReverse
      yDomain={multipleDomain}
      dots
      xTickFormatter={shortMonth}
      aria-label="Mac and Linux sales with descriptive series labels"
    />
  );
}

/** Interpolation modes shown side by side in the grid. */
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

/** Compare the eight line interpolation modes on the same source data. */
export function LineChartTypes(): JSX.Element {
  const series: readonly CartesianSeries[] = [
    { name: 'windows', color: 'teal.solid', strokeWidth: 2 },
    { name: 'mac', color: 'orange.solid', strokeWidth: 2 },
    { name: 'linux', color: 'blue.solid', strokeWidth: 2 },
  ];
  return (
    <SimpleGrid minChildWidth="400px" style={{ gap: 'var(--leverui-spacing-10)' }}>
      <For each={curveTypes}>
        {/** Label and draw one interpolation mode in a separate chart. */}
        {(curve) => (
          <Stack gap="4">
            <Text
              textStyle="sm"
              style={{
                'font-weight': 'var(--leverui-font-weights-semibold)',
                'margin-inline-start': 'var(--leverui-spacing-8)',
              }}
            >{`<LineChart curve="${curve}" />`}</Text>
            <LineChart
              data={monthlyData}
              series={series}
              xKey="month"
              curve={curve}
              showYAxis
              tooltip={false}
              xTickFormatter={shortMonth}
              aria-label={`${curve} monthly line chart`}
            />
          </Stack>
        )}
      </For>
    </SimpleGrid>
  );
}
