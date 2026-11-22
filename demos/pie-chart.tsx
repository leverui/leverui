import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  PieChartBasic,
  PieChartLabelInside,
  PieChartLabelOutside,
  PieChartLegend,
  PieChartNoStroke,
  PieChartPointLabel,
  PieChartStartAngle,
} from './examples/pie-chart-examples';

export const meta = {
  component: PieChartBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: PieChartBasic };
export const NoStroke: Story = { render: PieChartNoStroke };
export const LabelInside: Story = { render: PieChartLabelInside };
export const LabelOutside: Story = { render: PieChartLabelOutside };
export const Legend: Story = { render: PieChartLegend };
export const PointLabel: Story = { render: PieChartPointLabel };
export const StartAngle: Story = { render: PieChartStartAngle };
