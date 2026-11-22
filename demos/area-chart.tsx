import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  AreaChartAxisLabel,
  AreaChartBasic,
  AreaChartDashedArea,
  AreaChartDots,
  AreaChartFillWithValue,
  AreaChartPercent,
} from './examples/area-chart-basic';
import {
  AreaChartGradient,
  AreaChartNulls,
  AreaChartPointLabel,
  AreaChartReferenceArea,
  AreaChartReferenceLines,
  AreaChartTypes,
  AreaChartValueAxis,
} from './examples/area-chart-more';

export const meta = {
  component: AreaChartBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: AreaChartBasic };
export const FillWithValue: Story = { render: AreaChartFillWithValue };
export const Percent: Story = { render: AreaChartPercent };
export const AxisLabel: Story = { render: AreaChartAxisLabel };
export const DashedArea: Story = { render: AreaChartDashedArea };
export const Dots: Story = { render: AreaChartDots };
export const Gradient: Story = { render: AreaChartGradient };
export const Nulls: Story = { render: AreaChartNulls };
export const PointLabel: Story = { render: AreaChartPointLabel };
export const ReferenceArea: Story = { render: AreaChartReferenceArea };
export const ReferenceLines: Story = { render: AreaChartReferenceLines };
export const Types: Story = { render: AreaChartTypes };
export const ValueAxis: Story = { render: AreaChartValueAxis };
