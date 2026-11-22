import type { Demo, DemoMeta } from './demo-types';
import {
  BadgeBasic,
  BadgeWithContext,
  BadgeWithGroup,
  BadgeWithIcon,
  BadgeWithSizes,
  BadgeWithVariants,
} from './examples/badge-standard';
import { BadgeSizeTable, BadgeVariantTable } from './examples/badge-tables';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: BadgeBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = {
  render: BadgeBasic,
};
export const Icon: Story = {
  render: BadgeWithIcon,
  parameters: { guide: { description: 'Render an icon within the badge directly' } },
};
export const Variants: Story = {
  render: BadgeWithVariants,
  parameters: { guide: { description: 'Badges come in different variants' } },
};
export const Sizes: Story = {
  render: BadgeWithSizes,
  parameters: { guide: { description: 'Badges come in different sizes' } },
};
export const SizeMatrix: Story = { render: BadgeSizeTable };
export const VariantMatrix: Story = { render: BadgeVariantTable };
export const Context: Story = { render: BadgeWithContext };
export const Group: Story = { render: BadgeWithGroup };
