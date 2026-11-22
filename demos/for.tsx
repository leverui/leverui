import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { ForBasic, ForWithFallback, ForWithObject } from './examples/for-standard';

export const meta = {
  component: ForBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: ForBasic };
export const WithObject: Story = {
  render: ForWithObject,
  parameters: {
    guide: {
      description: "Here's an example of using the `For` component to loop over an object.",
    },
  },
};
export const WithFallback: Story = {
  render: ForWithFallback,
  parameters: {
    guide: {
      description:
        'Use the `fallback` prop to render a fallback component when the array is empty.',
    },
  },
};
