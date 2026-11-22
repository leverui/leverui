import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { BarChartBarColor, BarChartBasic, BarChartRounded } from './examples/bar-chart-basic';
import { BarChartLegendPosition, BarChartMultiple } from './examples/bar-chart-groups';
import { BarChartPercent, BarChartStacked, BarChartStackedMix } from './examples/bar-chart-stacks';
import { BarChartFormatter, BarChartNoGap } from './examples/bar-chart-sales';
import { BarChartRange } from './examples/bar-chart-range';
import { BarChartHistogram } from './examples/bar-chart-histogram';
import { BarChartComposition } from './examples/bar-chart-composition';
import { BarChartWithAvatarTicks } from './examples/bar-chart-avatar-ticks';
import { BarChartHorizontal } from './examples/bar-chart-horizontal';
import { BarChartCandlestick } from './examples/bar-chart-candlestick';
import {
  BarChartBarLabel,
  BarChartFillWithValue,
  BarChartReferenceLines,
} from './examples/bar-chart-features';

export const meta = {
  component: BarChartBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const BarColor: Story = { render: BarChartBarColor };
export const Candlestick: Story = { render: BarChartCandlestick };
export const Basic: Story = { render: BarChartBasic };
export const FillWithValue: Story = { render: BarChartFillWithValue };
export const LegendPosition: Story = { render: BarChartLegendPosition };
export const Multiple: Story = { render: BarChartMultiple };
export const Percent: Story = { render: BarChartPercent };
export const Rounded: Story = { render: BarChartRounded };
export const BarLabel: Story = { render: BarChartBarLabel };
export const ReferenceLines: Story = { render: BarChartReferenceLines };
export const Range: Story = { render: BarChartRange };
export const Stacked: Story = { render: BarChartStacked };
export const StackedMix: Story = { render: BarChartStackedMix };
export const Formatter: Story = { render: BarChartFormatter };
export const Composition: Story = { render: BarChartComposition };
export const Histogram: Story = { render: BarChartHistogram };
export const Horizontal: Story = { render: BarChartHorizontal };
export const NoGap: Story = { render: BarChartNoGap };
export const AvatarTicks: Story = { render: BarChartWithAvatarTicks };
