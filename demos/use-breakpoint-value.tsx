import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { UseBreakpointValueBasic } from './examples/use-breakpoint-value-basic';

export const meta = {
  component: UseBreakpointValueBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: UseBreakpointValueBasic };
