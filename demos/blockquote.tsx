import type { Demo, DemoMeta } from './demo-types';
import {
  BlockquoteWithAvatar,
  BlockquoteWithCustomIcon,
  BlockquoteWithIcon,
} from './examples/blockquote-rich';
import {
  BlockquoteBasic,
  BlockquoteWithCite,
  BlockquoteWithColors,
  BlockquoteWithJustify,
  BlockquoteWithVariants,
} from './examples/blockquote-standard';
import { BlockquoteVariantTable } from './examples/blockquote-variants';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: BlockquoteBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach guide settings to one example. */
function guide(settings: { description: string; heading?: boolean }): Story['parameters'] {
  return { guide: settings };
}

export const Basic: Story = { render: BlockquoteBasic };
export const Cite: Story = {
  render: BlockquoteWithCite,
  parameters: guide({
    description:
      'To provide reference about the blockquote, pass the `cite` prop to `Blockquote.Content` pointing to the quote url, and render the `Blockquote.Caption` component to display name of quote author.',
  }),
};
export const Colors: Story = {
  render: BlockquoteWithColors,
  parameters: guide({
    description: 'Use the `colorPalette` prop to change the color of the blockquote.',
  }),
};
export const Variants: Story = {
  render: BlockquoteWithVariants,
  parameters: guide({
    description: 'Use the `variant` prop to change the visual style of the blockquote.',
  }),
};
export const Icon: Story = {
  render: BlockquoteWithIcon,
  parameters: guide({
    description:
      "Here's an example of how to compose the `Float` and `Blockquote.Icon` to show an icon on the blockquote. The default icon is a double quote.",
  }),
};
export const CustomIcon: Story = {
  render: BlockquoteWithCustomIcon,
  parameters: guide({
    heading: false,
    description: 'Alternatively, you can render a custom icon.',
  }),
};
export const Justify: Story = {
  render: BlockquoteWithJustify,
  parameters: guide({
    description: 'Use the `justify` prop to change the alignment of the blockquote.',
  }),
};
export const Avatar: Story = {
  render: BlockquoteWithAvatar,
  parameters: guide({
    description:
      "Here's an example of how to compose the `Blockquote`, `Avatar` and `Float` components to create a stunning testimonial component.",
  }),
};
export const VariantMatrix: Story = { render: BlockquoteVariantTable };
