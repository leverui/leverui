import type { Demo, DemoMeta } from './demo-types';
import {
  SeparatorBasic,
  SeparatorVertical,
  SeparatorWithLabel,
  SeparatorWithResponsiveOrientation,
  SeparatorWithSizes,
  SeparatorWithVariants,
} from './examples/separator-display';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: SeparatorBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: SeparatorBasic };
export const Variants: Story = {
  render: SeparatorWithVariants,
  parameters: {
    guide: { description: 'Use the `variant` prop to change the appearance of the separator.' },
  },
};
export const Sizes: Story = {
  render: SeparatorWithSizes,
  parameters: {
    guide: { description: 'Use the `size` prop to change the size of the separator.' },
  },
};
export const Label: Story = {
  render: SeparatorWithLabel,
  parameters: {
    guide: { description: 'Place text beside the `Separator` to add a label to the separator.' },
  },
};
export const Vertical: Story = {
  render: SeparatorVertical,
  parameters: {
    guide: {
      description: 'Use the `orientation` prop to change the orientation of the separator.',
    },
  },
};
export const ResponsiveOrientation: Story = {
  render: SeparatorWithResponsiveOrientation,
  parameters: {
    guide: {
      description:
        "Here's an example of how to change the `orientation` property based on the screen size.",
      after:
        '> When the `orientation` prop is a responsive value, the separator will be rendered without `aria-orientation` and the role is set to `presentation`.',
    },
  },
};
