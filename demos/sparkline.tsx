import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  SparklineBarChart,
  SparklineBasic,
  SparklineGradient,
  SparklineInteraction,
  SparklineLineChart,
  SparklineReference,
} from './examples/sparkline-basic';
import { SparklineStat, SparklineStock } from './examples/sparkline-cards';

export const meta = {
  component: SparklineBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const BarChart: Story = { render: SparklineBarChart };
export const Basic: Story = { render: SparklineBasic };
export const Stock: Story = { render: SparklineStock };
export const LineChart: Story = { render: SparklineLineChart };
export const Gradient: Story = { render: SparklineGradient };
export const Interaction: Story = { render: SparklineInteraction };
export const Reference: Story = { render: SparklineReference };
export const Stat: Story = { render: SparklineStat };
