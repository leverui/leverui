import type { Demo, DemoMeta } from './demo-types';
import {
  HeadingBasic,
  HeadingWithAsProp,
  HeadingWithSizes,
  HeadingWithWeights,
} from './examples/heading-display';
import {
  HeadingWithComposition,
  HeadingWithGradient,
  HeadingWithHighlight,
} from './examples/heading-composition';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: HeadingBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: HeadingBasic };
export const Sizes: Story = {
  render: HeadingWithSizes,
  parameters: {
    guide: { description: 'Use the `size` prop to change the size of the heading component.' },
  },
};
export const Highlight: Story = {
  render: HeadingWithHighlight,
  parameters: {
    guide: {
      description:
        'Compose the `Heading` component with the `Highlight` component to highlight text.',
    },
  },
};
export const AsProps: Story = {
  name: 'AsProps',
  render: HeadingWithAsProp,
  parameters: {
    guide: { description: 'Use the `as` prop to render the heading as another HTML element.' },
  },
};
export const Weights: Story = {
  render: HeadingWithWeights,
  parameters: {
    guide: {
      description:
        'Use the `style` prop with a `font-weight` value to change the weight of the heading component.',
    },
  },
};
export const Composition: Story = {
  render: HeadingWithComposition,
  parameters: {
    guide: { description: 'Use the `Heading` component to compose other components.' },
  },
};
export const Gradient: Story = { render: HeadingWithGradient };
