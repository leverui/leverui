import type { Demo, DemoMeta } from './demo-types';
import {
  TagAsButton,
  TagWithIcon,
  TagWithSizes,
  TagWithVariants,
} from './examples/tag-composition';
import { TagBasic, TagWithAvatar, TagWithClose, TagWithOverflow } from './examples/tag-standard';
import { TagWithColors } from './examples/tag-matrices';
import { TagSizeTable } from './examples/tag-size-table';
import { TagVariantTable } from './examples/tag-variant-table';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: TagBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a description and optional following Markdown. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after && { after }) } };
}

export const Basic: Story = { render: TagBasic };
export const Icon: Story = {
  render: TagWithIcon,
  parameters: guide(
    'Use the `Tag.StartElement` and `Tag.EndElement` components to add an icon to the start or end of the tag',
  ),
};
export const Variants: Story = {
  render: TagWithVariants,
  parameters: guide('Use the `variant` prop to change the appearance of the tag.'),
};
export const Sizes: Story = {
  render: TagWithSizes,
  parameters: guide('Use the `size` prop to change the size of the tag.'),
};
export const Colors: Story = {
  render: TagWithColors,
  parameters: guide('Use the `colorPalette` prop to change the color of the tag.'),
};
export const Close: Story = {
  render: TagWithClose,
  parameters: guide(
    'Use the `Tag.CloseTrigger` within the `Tag.EndElement` to make the tag closable.',
  ),
};
export const Overflow: Story = {
  render: TagWithOverflow,
  parameters: guide(
    'Use the `max-width` style to control the maximum width of the tag. When the content exceeds this width, it will be truncated with an ellipsis.',
    '> This is particularly useful when dealing with dynamic or user-generated content where the length might vary.',
  ),
};
export const Avatar: Story = {
  render: TagWithAvatar,
  parameters: guide(
    'The tag component has been designed to work well with the `Avatar` component.',
    "> Note: Set the avatar size to `full` to ensure it's sized correctly.",
  ),
};
export const AsButton: Story = {
  render: TagAsButton,
  parameters: guide('Use the `asChild` prop to render the tag as a button.'),
};
export const SizeMatrix: Story = { render: TagSizeTable };
export const VariantMatrix: Story = { render: TagVariantTable };
