import type { Demo, DemoMeta } from './demo-types';
import {
  IconButtonBasic,
  IconButtonRounded,
  IconButtonWithColors,
  IconButtonWithSizes,
  IconButtonWithVariants,
} from './examples/icon-button-display';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: IconButtonBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: IconButtonBasic };
export const Sizes: Story = {
  render: IconButtonWithSizes,
  parameters: { guide: { description: 'Use the `size` prop to change the size of the button.' } },
};
export const Variants: Story = {
  render: IconButtonWithVariants,
  parameters: { guide: { description: 'Use the `variant` prop to change its visual style' } },
};
export const Colors: Story = {
  render: IconButtonWithColors,
  parameters: {
    guide: { description: 'Use the `colorPalette` prop to change the color of the button' },
  },
};
export const Rounded: Story = {
  render: IconButtonRounded,
  parameters: {
    guide: {
      description:
        'Set the `border-radius` style to `var(--lui-radii-full)` to make the button fully rounded',
    },
  },
};
