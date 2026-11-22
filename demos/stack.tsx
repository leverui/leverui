import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  StackBasic,
  StackHorizontal,
  StackWithHstack,
  StackWithResponsiveDirection,
  StackWithVstack,
} from './examples/stack-direction';
import {
  StackWithCustomSeparator,
  StackWithResponsiveSeparator,
  StackWithSeparator,
} from './examples/stack-separators';

export const meta = {
  component: StackBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description for one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: StackBasic };
export const Horizontal: Story = {
  render: StackHorizontal,
  parameters: guide('Use the `direction` prop to change the direction of the stack.'),
};
export const HStack: Story = {
  name: 'HStack',
  render: StackWithHstack,
  parameters: guide(
    'Alternatively, you can use the `HStack` to create a horizontal stack and align its children horizontally.',
  ),
};
export const VStack: Story = {
  name: 'VStack',
  render: StackWithVstack,
  parameters: guide(
    'Use the `VStack` to create a vertical stack and align its children vertically.',
  ),
};
export const Separator: Story = {
  render: StackWithSeparator,
  parameters: guide('Use the `separator` prop to add a separator between the stack items.'),
};
export const ResponsiveDirection: Story = {
  name: 'ResponsiveDirection',
  render: StackWithResponsiveDirection,
  parameters: guide('Use the `direction` prop to change the direction of the stack responsively.'),
};
export const CustomSeparator: Story = { name: 'CustomSeparator', render: StackWithCustomSeparator };
export const ResponsiveSeparator: Story = {
  name: 'ResponsiveSeparator',
  render: StackWithResponsiveSeparator,
};
