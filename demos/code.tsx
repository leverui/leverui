import type { Demo, DemoMeta } from './demo-types';
import {
  CodeBasic,
  CodeWithColors,
  CodeWithSizes,
  CodeWithVariants,
} from './examples/code-display';
import { CodeSizeTable, CodeVariantTable } from './examples/code-tables';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: CodeBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: CodeBasic };
export const Sizes: Story = {
  render: CodeWithSizes,
  parameters: {
    guide: { description: 'Use the `size` prop to change the size of the code component.' },
  },
};
export const Variants: Story = {
  render: CodeWithVariants,
  parameters: {
    guide: {
      description: 'Use the `variant` prop to change the appearance of the code component.',
    },
  },
};
export const Colors: Story = {
  render: CodeWithColors,
  parameters: {
    guide: {
      description: 'Use the `colorPalette` prop to change the color scheme of the component.',
    },
  },
};
export const SizeMatrix: Story = { render: CodeSizeTable };
export const VariantMatrix: Story = { render: CodeVariantTable };
