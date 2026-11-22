import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  BarSegmentBarSize,
  BarSegmentBasic,
  BarSegmentLegend,
  BarSegmentReference,
  BarSegmentTooltip,
} from './examples/bar-segment-examples';

export const meta = {
  component: BarSegmentBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: BarSegmentBasic };
export const Reference: Story = { render: BarSegmentReference };
export const Legend: Story = { render: BarSegmentLegend };
export const BarSize: Story = { render: BarSegmentBarSize };
export const Tooltip: Story = { render: BarSegmentTooltip };
