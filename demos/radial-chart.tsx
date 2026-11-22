import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { RadialChartBasic, RadialChartLabel, RadialChartLegend } from './examples/radial-bar-chart';

export const meta = {
  component: RadialChartBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: RadialChartBasic };
export const Legend: Story = { render: RadialChartLegend };
export const Label: Story = { render: RadialChartLabel };
