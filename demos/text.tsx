import type { Demo, DemoMeta } from './demo-types';
import { TextBasic, TextWithAsProp, TextWithSizes, TextWithWeights } from './examples/text-display';
import { TextWithLineClamp, TextWithTruncate } from './examples/text-overflow';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: TextBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: TextBasic };
export const AsProps: Story = { name: 'AsProps', render: TextWithAsProp };
export const Truncate: Story = {
  render: TextWithTruncate,
  parameters: {
    guide: { description: 'Use the `truncate` prop to truncate the text after a single line.' },
  },
};
export const LineClamp: Story = {
  name: 'LineClamp',
  render: TextWithLineClamp,
  parameters: {
    guide: {
      description: 'Use the `lineClamp` prop to truncate the text after a certain number of lines.',
    },
  },
};
export const Sizes: Story = {
  render: TextWithSizes,
  parameters: {
    guide: {
      description: 'Use the `textStyle` prop to change the size of the text.',
    },
  },
};
export const Weights: Story = {
  render: TextWithWeights,
  parameters: {
    guide: {
      description:
        'Use the `style` prop with a `font-weight` value to change the weight of the text.',
    },
  },
};
