import type { Demo, DemoMeta } from './demo-types';
import {
  ListBasic,
  ListNested,
  ListOrdered,
  ListWithIcon,
  ListWithMarkerStyle,
} from './examples/list-display';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: ListBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description to one example. */
function guide(description: string): Story['parameters'] {
  return {
    guide: { description },
  };
}

export const Basic: Story = { render: ListBasic };
export const Nested: Story = {
  render: ListNested,
  parameters: guide("Here's an example of a nested list"),
};
export const Ordered: Story = {
  render: ListOrdered,
  parameters: guide('Pass the `as="ol"` prop to create an ordered list'),
};
export const Icon: Story = {
  render: ListWithIcon,
  parameters: guide('Use the `List.Indicator` component to add an icon to the list'),
};
export const MarkerStyle: Story = {
  render: ListWithMarkerStyle,
  parameters: guide('Use the `::marker` CSS selector to style the marker of the list'),
};
