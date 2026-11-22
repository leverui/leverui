import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  LineChartAxesLabel,
  LineChartBasic,
  LineChartMultiple,
  LineChartNoDots,
  LineChartStartEndTick,
  LineChartValueFormatter,
} from './examples/line-chart-basic';
import {
  LineChartDashed,
  LineChartNulls,
  LineChartStrokeWidth,
  LineChartValueDomain,
} from './examples/line-chart-styles';
import {
  LineChartComposition,
  LineChartSeriesLabel,
  LineChartTypes,
} from './examples/line-chart-composed';
import {
  LineChartCustomDot,
  LineChartGradient,
  LineChartPointLabel,
} from './examples/line-chart-markers';
import {
  LineChartCustomTooltip,
  LineChartLegendInteraction,
} from './examples/line-chart-interactive';
import { LineChartReferencePoint } from './examples/line-chart-reference';
import { LineChartBiaxial } from './examples/line-chart-biaxial';

export const meta = {
  component: LineChartBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const AxesLabel: Story = { render: LineChartAxesLabel };
export const Basic: Story = { render: LineChartBasic };
export const Multiple: Story = { render: LineChartMultiple };
export const NoDots: Story = { render: LineChartNoDots };
export const StartEndTick: Story = { render: LineChartStartEndTick };
export const ValueFormatter: Story = { render: LineChartValueFormatter };
export const Dashed: Story = { render: LineChartDashed };
export const Nulls: Story = { render: LineChartNulls };
export const StrokeWidth: Story = { render: LineChartStrokeWidth };
export const ValueDomain: Story = { render: LineChartValueDomain };
export const Composition: Story = { render: LineChartComposition };
export const SeriesLabel: Story = { render: LineChartSeriesLabel };
export const Types: Story = { render: LineChartTypes };
export const CustomDot: Story = { render: LineChartCustomDot };
export const Gradient: Story = { render: LineChartGradient };
export const PointLabel: Story = { render: LineChartPointLabel };
export const CustomTooltip: Story = { render: LineChartCustomTooltip };
export const LegendInteraction: Story = { render: LineChartLegendInteraction };
export const ReferencePoint: Story = { render: LineChartReferencePoint };
export const Biaxial: Story = { render: LineChartBiaxial };
