import type { Demo, DemoMeta } from './demo-types';
import { EmBasic } from './examples/em-standard';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: EmBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: EmBasic };
