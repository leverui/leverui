import type { Demo, DemoMeta } from './demo-types';
import {
  EmptyStateBasic,
  EmptyStateSizes,
  EmptyStateWithAction,
  EmptyStateWithList,
} from './examples/empty-state-standard';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: EmptyStateBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: EmptyStateBasic };
export const Sizes: Story = {
  render: EmptyStateSizes,
  parameters: {
    guide: { description: 'Use the `size` prop to set the size of the Empty state.' },
  },
};
export const Action: Story = {
  render: EmptyStateWithAction,
  parameters: {
    guide: { description: "Here's an example of an empty state with an action button." },
  },
};
export const List: Story = {
  render: EmptyStateWithList,
  parameters: {
    guide: { description: "Here's an example of an empty state with a list." },
  },
};
