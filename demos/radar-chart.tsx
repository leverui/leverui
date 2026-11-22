import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  RadarChartBasic,
  RadarChartCircleGrid,
  RadarChartDots,
  RadarChartFilledGrid,
  RadarChartLinesOnly,
  RadarChartMultiple,
  RadarChartPointLabel,
  RadarChartTooltip,
} from './examples/radar-chart-examples';

export const meta = {
  component: RadarChartBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: RadarChartBasic };
export const LinesOnly: Story = { render: RadarChartLinesOnly };
export const Multiple: Story = { render: RadarChartMultiple };
export const CircleGrid: Story = { render: RadarChartCircleGrid };
export const Dots: Story = { render: RadarChartDots };
export const FilledGrid: Story = { render: RadarChartFilledGrid };
export const PointLabel: Story = { render: RadarChartPointLabel };
export const Tooltip: Story = { render: RadarChartTooltip };
