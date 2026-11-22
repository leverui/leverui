import type { Demo, DemoMeta } from './demo-types';
import {
  RadiomarkBasic,
  RadiomarkStates,
  RadiomarkVariants,
  RadiomarkWithColors,
  RadiomarkWithFilled,
  RadiomarkWithSizes,
} from './examples/radiomark-display';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: RadiomarkBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: RadiomarkBasic };
export const States: Story = {
  render: RadiomarkStates,
  parameters: guide(
    'The Radiomark component supports checked and unchecked states, with optional disabled state.',
  ),
};
export const Variants: Story = {
  render: RadiomarkVariants,
  parameters: guide('Use the `variant` prop to change the visual style of the radiomark.'),
};
export const Sizes: Story = {
  render: RadiomarkWithSizes,
  parameters: guide('Use the `size` prop to change the size of the radiomark.'),
};
export const Colors: Story = {
  render: RadiomarkWithColors,
  parameters: guide('Use the `colorPalette` prop to change the color scheme of the radiomark.'),
};
export const Filled: Story = {
  render: RadiomarkWithFilled,
  parameters: guide(
    'Use the `filled` prop with the `outline` variant to add a background color to the radiomark.',
  ),
};
