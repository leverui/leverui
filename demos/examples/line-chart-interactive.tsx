import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, LineChart, Text, VStack } from '../../src';
import type { CartesianDatum, CartesianSeries } from '../../src/charts/cartesian-types';
import { customerData, multipleData, multipleDomain, shortMonth } from './line-chart-data';

/** Render the teal customer tooltip for one active row. */
function customerTooltip(row: CartesianDatum, series: readonly CartesianSeries[]): JSX.Element {
  return (
    <div
      role="tooltip"
      style={{
        position: 'absolute',
        top: '8px',
        left: '42%',
        width: '160px',
        padding: '12px',
        'border-radius': '4px',
        background: 'var(--lui-colors-teal-subtle)',
        'pointer-events': 'none',
        'z-index': '1',
      }}
    >
      <HStack>{row.month} Customers</HStack>
      <For each={series}>
        {/** Show each customer count with its theme-color marker. */}
        {(item) => (
          <HStack>
            <span
              style={{
                width: '8px',
                height: '8px',
                background: `var(--lui-colors-${item.color.replace('.', '-')})`,
              }}
            />
            <Text textStyle="xl">{row[item.name]}</Text>
          </HStack>
        )}
      </For>
    </div>
  );
}

/** Replace the standard chart tooltip with the teal customer card. */
export function LineChartCustomTooltip(): JSX.Element {
  return (
    <LineChart
      data={customerData}
      series={[{ name: 'Customers', color: 'teal.solid', strokeWidth: 2 }]}
      xKey="month"
      showYAxis
      xAxisLabel="Month"
      yAxisLabel="Customers"
      xTickFormatter={shortMonth}
      tooltipContent={customerTooltip}
      aria-label="Monthly customers with a custom tooltip"
    />
  );
}

/** Dim unselected lines while hovering a series label. */
export function LineChartLegendInteraction(): JSX.Element {
  return (
    <VStack gap="4" style={{ position: 'relative' }}>
      <LineChart
        data={multipleData}
        series={[
          { name: 'mac', color: 'teal.solid', strokeWidth: 2 },
          { name: 'linux', color: 'purple.solid', strokeWidth: 2 },
        ]}
        xKey="month"
        showYAxis
        showLegend
        legendReverse
        yDomain={multipleDomain}
        legendInteraction="hover"
        dots
        xTickFormatter={shortMonth}
        aria-label="Mac and Linux sales with interactive legend"
      />
      <HStack
        textStyle="xs"
        style={{
          color: 'var(--lui-colors-teal-fg)',
        }}
      >
        Hover on &quot;mac&quot; ↑
      </HStack>
    </VStack>
  );
}
