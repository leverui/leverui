import type { Demo, DemoMeta } from './demo-types';
import { PaginationContent } from './examples/pagination-content';
import { PaginationAsLink } from './examples/pagination-link';
import { PaginationSizes } from './examples/pagination-sizes';
import {
  PaginationBasic,
  PaginationControlled,
  PaginationSiblingCount,
} from './examples/pagination-standard';
import {
  PaginationCompact,
  PaginationCountText,
  PaginationCustomFormat,
} from './examples/pagination-text';
import { PaginationAttached, PaginationVariants } from './examples/pagination-variants';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: PaginationBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach copy and optional follow-up notes to an example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after !== undefined && { after }) } };
}

export const Basic: Story = { render: PaginationBasic };
export const Sizes: Story = {
  render: PaginationSizes,
  parameters: guide(
    'Use the `size` prop to change the size of the pagination.',
    '> The pagination sizes are mapped to the `Button` component sizes.',
  ),
};
export const Variants: Story = {
  render: PaginationVariants,
  parameters: guide(
    'Use the `variant` prop to control the variant of the pagination items and ellipsis.',
    '> The variant matches the `Button` component variant.',
  ),
};
export const Controlled: Story = {
  render: PaginationControlled,
  parameters: guide('Use the `page` and `onPageChange` props to control the current page.'),
};
export const SiblingCount: Story = {
  render: PaginationSiblingCount,
  parameters: guide(
    'Use `siblingCount` to control the number of sibling pages to show before and after the current page.',
  ),
};
export const Compact: Story = {
  render: PaginationCompact,
  parameters: guide(
    'Use the `Pagination.PageText` to create a compact pagination. This can be useful for mobile views.',
  ),
};
export const AsLink: Story = {
  render: PaginationAsLink,
  parameters: guide("Here's an example of rendering the pagination as links."),
};
export const Attached: Story = {
  render: PaginationAttached,
  parameters: guide(
    "Here's an example of composing the pagination with the `Group` component to attach the pagination items and triggers.",
  ),
};
export const CountText: Story = {
  render: PaginationCountText,
  parameters: guide(
    'Pass `format="long"` to the `Pagination.PageText` component to show the count text.',
  ),
};
export const CustomFormat: Story = {
  render: PaginationCustomFormat,
  parameters: guide(
    'Pass a function to the `format` prop of `Pagination.PageText` to customize or localize the page text.',
  ),
};
export const Content: Story = {
  render: PaginationContent,
  parameters: guide(
    "Here's an example of controlling the pagination state and using the state to chunk the data.",
  ),
};
