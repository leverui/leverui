import type { Demo, DemoMeta } from './demo-types';
import {
  CheckmarkBasic,
  CheckmarkIndeterminate,
  CheckmarkStates,
  CheckmarkWithColors,
  CheckmarkWithFilled,
  CheckmarkWithSizes,
  CheckmarkWithVariants,
} from './examples/checkmark-guide';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: CheckmarkBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description to one example. */
function guide(description?: string): Story['parameters'] {
  return { guide: { ...(description && { description }) } };
}

export const Basic: Story = { render: CheckmarkBasic, parameters: guide() };
export const Indeterminate: Story = {
  render: CheckmarkIndeterminate,
  parameters: guide('Use the `indeterminate` prop to show an indeterminate state.'),
};
export const States: Story = {
  render: CheckmarkStates,
  parameters: guide(
    'The Checkmark component supports three states: unchecked (default), checked, and indeterminate.',
  ),
};
export const Variants: Story = {
  render: CheckmarkWithVariants,
  parameters: guide('Use the `variant` prop to change the visual style of the checkmark.'),
};
export const Sizes: Story = {
  render: CheckmarkWithSizes,
  parameters: guide('Use the `size` prop to change the size of the checkmark.'),
};
export const Colors: Story = {
  render: CheckmarkWithColors,
  parameters: guide('Use the `colorPalette` prop to change the color scheme of the checkmark.'),
};
export const Filled: Story = {
  render: CheckmarkWithFilled,
  parameters: guide(
    'Use the `filled` prop with the `outline` variant to add a background color to the checkmark.',
  ),
};
