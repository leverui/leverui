import type { Demo, DemoMeta } from './demo-types';
import { MarkBasic, MarkWithVariants } from './examples/mark-display';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: MarkBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: MarkBasic };
export const Variants: Story = {
  render: MarkWithVariants,
  parameters: {
    guide: { description: 'Use the `variant` prop to change the color of the mark.' },
  },
};
