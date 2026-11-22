import type { Demo, DemoMeta } from './demo-types';
import {
  CloseButtonBasic,
  CloseButtonWithCustomIcon,
  CloseButtonWithSizes,
  CloseButtonWithVariants,
} from './examples/close-button-standard';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: CloseButtonBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: CloseButtonBasic };
export const Sizes: Story = {
  render: CloseButtonWithSizes,
  parameters: {
    guide: { description: 'Use the `size` prop to change the size of the close button.' },
  },
};
export const Variants: Story = {
  render: CloseButtonWithVariants,
  parameters: {
    guide: { description: 'Use the `variant` prop to change the appearance of the close button.' },
  },
};
export const CustomIcon: Story = {
  name: 'CustomIcon',
  render: CloseButtonWithCustomIcon,
  parameters: {
    guide: {
      description: 'Pass the custom icon to the `children` of the `CloseButton` component.',
    },
  },
};
