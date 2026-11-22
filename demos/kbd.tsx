import type { Demo, DemoMeta } from './demo-types';
import {
  KbdBasic,
  KbdFunctionKeys,
  KbdWithCombinations,
  KbdWithGroup,
  KbdWithSizes,
  KbdWithVariants,
  KbdWithinText,
} from './examples/kbd-display';
import { KbdSizeTable, KbdVariantTable } from './examples/kbd-tables';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: KbdBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: KbdBasic };
export const Combinations: Story = {
  render: KbdWithCombinations,
  parameters: { guide: { description: 'Render `Kbd` to showcase key combinations' } },
};
export const Group: Story = {
  render: KbdWithGroup,
  parameters: {
    guide: {
      description:
        'Use `KbdPropsProvider` to group the keys of a shortcut. Its `size` and `variant` apply to every key inside.',
    },
  },
};
export const FunctionKeys: Story = {
  render: KbdFunctionKeys,
  parameters: {
    guide: { description: "Here's an example of using `Kbd` to showcase function keys" },
  },
};
export const Variants: Story = {
  render: KbdWithVariants,
  parameters: {
    guide: {
      description: 'Use the `variant` prop to change the appearance of the `Kbd` component',
    },
  },
};
export const Sizes: Story = {
  render: KbdWithSizes,
  parameters: {
    guide: { description: 'Use the `size` prop to change the size of the `Kbd` component' },
  },
};
export const WithinText: Story = {
  render: KbdWithinText,
  parameters: { guide: { description: 'Use `Kbd` within text to highlight key combinations' } },
};
export const SizeMatrix: Story = { render: KbdSizeTable };
export const VariantMatrix: Story = { render: KbdVariantTable };
