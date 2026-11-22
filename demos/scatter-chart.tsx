import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  ScatterChartBasic,
  ScatterChartConnectDots,
  ScatterChartLegend,
  ScatterChartMultiple,
  ScatterChartTrendLine,
} from './examples/scatter-chart-examples';

export const meta = {
  component: ScatterChartBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: ScatterChartBasic };
export const Legend: Story = { render: ScatterChartLegend };
export const Multiple: Story = { render: ScatterChartMultiple };
export const ConnectDots: Story = { render: ScatterChartConnectDots };
export const TrendLine: Story = { render: ScatterChartTrendLine };
