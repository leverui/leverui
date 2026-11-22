import type { Demo, DemoMeta } from './demo-types';
import { ShowBasic, ShowWithFallback, ShowWithRenderProp } from './examples/show-display';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: ShowBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: ShowBasic };
export const WithFallback: Story = {
  render: ShowWithFallback,
  parameters: {
    guide: {
      description:
        'Use the `fallback` prop to render a fallback component when the array is empty or undefined.',
    },
  },
};
export const WithRenderProp: Story = {
  render: ShowWithRenderProp,
  parameters: {
    guide: {
      description:
        'Use the `children` render prop to narrow the type of the `when` value and remove `undefined` | `null`',
    },
  },
};
