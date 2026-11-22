import type { Demo, DemoMeta } from './demo-types';
import { AvatarWithRing, AvatarWithSizes, AvatarWithVariants } from './examples/avatar-appearance';
import { AvatarWithBadge, AvatarWithColors, AvatarWithRandomColor } from './examples/avatar-colors';
import { AvatarGroupWithStacking, AvatarWithGroup } from './examples/avatar-groups';
import { AvatarWithOverflow } from './examples/avatar-overflow';
import { AvatarWithStore } from './examples/avatar-store';
import {
  AvatarBasic,
  AvatarPersona,
  AvatarWithFallback,
  AvatarWithShape,
} from './examples/avatar-standard';
import { AvatarSizeTable, AvatarVariantTable } from './examples/avatar-tables';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: AvatarBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: AvatarBasic };
export const Sizes: Story = {
  render: AvatarWithSizes,
  parameters: guide('Use the `size` prop to change the size of the avatar'),
};
export const Variants: Story = {
  render: AvatarWithVariants,
  parameters: guide('Use the `variant` prop to change the variant of the avatar'),
};
export const Shape: Story = {
  render: AvatarWithShape,
  parameters: guide(
    'Use the `shape` prop to change the shape of the avatar, from `rounded` to `square`',
  ),
};
export const Colors: Story = {
  render: AvatarWithColors,
  parameters: guide('Use the `colorPalette` prop to change the color of the avatar'),
};
export const Fallback: Story = {
  render: AvatarWithFallback,
  parameters: guide(
    'Render `Avatar.Icon` as the fallback when the name is not provided or when the image fails to load.',
  ),
};
export const RandomColor: Story = {
  render: AvatarWithRandomColor,
  parameters: guide(
    'Combine the `colorPalette` prop with some custom logic to dynamically change the color of the avatar',
  ),
};
export const Ring: Story = {
  render: AvatarWithRing,
  parameters: guide('Use `outline` styles in authored CSS to add a ring around the avatar'),
};
export const Group: Story = {
  render: AvatarWithGroup,
  parameters: guide('Use the `AvatarGroup` component to group multiple avatars together'),
};
export const GroupStacking: Story = {
  render: AvatarGroupWithStacking,
  parameters: guide(
    'When using the `AvatarGroup` component, you can use the `stacking` prop to change the stacking order of the avatars',
  ),
};
export const Persona: Story = {
  render: AvatarPersona,
  parameters: guide(
    "Here's an example of how to use the `Avatar` component to display a user persona.",
  ),
};
export const Badge: Story = {
  render: AvatarWithBadge,
  parameters: guide(
    'Show a badge on the right corner of the avatar by composing the `Float` and `Circle` components',
  ),
};
export const Overflow: Story = {
  render: AvatarWithOverflow,
  parameters: guide(
    "Here's an example of how to handle an overflow of avatars by composing the `Menu` and `Avatar` components.",
  ),
};
export const Store: Story = {
  render: AvatarWithStore,
  parameters: guide(
    'An alternative way to access the avatar state and methods is to use the `RootProvider` component and the `useAvatar` store hook.',
  ),
};
export const SizeMatrix: Story = { render: AvatarSizeTable };
export const VariantMatrix: Story = { render: AvatarVariantTable };
