import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  DonutChartAnglePadding,
  DonutChartBasic,
  DonutChartCenteredText,
  DonutChartDetachedSegment,
  DonutChartOtherLabel,
  DonutChartPointLabel,
  DonutChartStartAndEndAngle,
} from './examples/donut-chart-examples';

export const meta = {
  component: DonutChartBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: DonutChartBasic };
export const PointLabel: Story = { render: DonutChartPointLabel };
export const CenteredText: Story = { render: DonutChartCenteredText };
export const AnglePadding: Story = { render: DonutChartAnglePadding };
export const StartAndEndAngle: Story = { render: DonutChartStartAndEndAngle };
export const DetachedSegment: Story = { render: DonutChartDetachedSegment };
export const OtherLabel: Story = { render: DonutChartOtherLabel };
