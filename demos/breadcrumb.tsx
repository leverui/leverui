import type { Demo, DemoMeta } from './demo-types';
import { BreadcrumbWithMenu } from './examples/breadcrumb-menu';
import {
  BreadcrumbBasic,
  BreadcrumbWithEllipsis,
  BreadcrumbWithIcon,
  BreadcrumbWithSeparator,
  BreadcrumbWithSizes,
  BreadcrumbWithVariants,
} from './examples/breadcrumb-standard';
import { BreadcrumbSizeTable } from './examples/breadcrumb-tables';
import { BreadcrumbVariantTable } from './examples/breadcrumb-variant-table';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: BreadcrumbBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description to one example. */
function guide(description?: string): Story['parameters'] {
  return { guide: { ...(description && { description }) } };
}

export const Basic: Story = { render: BreadcrumbBasic, parameters: guide() };
export const Sizes: Story = {
  render: BreadcrumbWithSizes,
  parameters: guide('Use the `size` prop to change the size of the breadcrumb component'),
};
export const Variants: Story = {
  render: BreadcrumbWithVariants,
  parameters: guide('Use the `variant` prop to change the appearance of the breadcrumb component'),
};
export const Separator: Story = {
  render: BreadcrumbWithSeparator,
  parameters: guide('Use the `Breadcrumb.Separator` component to add a custom separator'),
};
export const Icon: Story = {
  render: BreadcrumbWithIcon,
  parameters: guide('Add a custom icon to the breadcrumb by rendering it within `Breadcrumb.Link`'),
};
export const Menu: Story = {
  render: BreadcrumbWithMenu,
  parameters: guide(
    'Wrap the `Breadcrumb.Link` inside the `MenuTrigger` to ensure it works correctly within the menu component',
  ),
};
export const Ellipsis: Story = {
  render: BreadcrumbWithEllipsis,
  parameters: guide(
    'Render the `Breadcrumb.Ellipsis` component to show an ellipsis after a breadcrumb item',
  ),
};
export const VariantMatrix: Story = { render: BreadcrumbVariantTable };
export const SizeMatrix: Story = { render: BreadcrumbSizeTable };
