import type { Demo, DemoMeta } from './demo-types';
import './table-examples.css';
import { TableWithSizes, TableWithVariants } from './examples/table-appearance';
import {
  TableBasic,
  TableWithColumnBorder,
  TableWithInteractive,
  TableWithNative,
  TableWithStriped,
} from './examples/table-basic-display';
import {
  TableWithCaption,
  TableWithCaptionTop,
  TableWithColumnGroup,
} from './examples/table-caption';
import { TableSizeTable, TableVariantTable } from './examples/table-matrices';
import { TableWithPagination } from './examples/table-pagination';
import { TableWithOverflow, TableWithStickyHeader } from './examples/table-scroll-display';
import { TableWithSelection, TableWithSelectionActionBar } from './examples/table-selection';
import {
  TableWithStickyColumn,
  TableWithStickyHeaderAndColumn,
} from './examples/table-sticky-display';
import { TableWithTanstack } from './examples/table-tanstack';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: TableBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description, and any Markdown that follows the example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after && { after }) } };
}

export const Basic: Story = { render: TableBasic };
export const Sizes: Story = {
  render: TableWithSizes,
  parameters: guide('Use the `size` prop to change the size of the table.'),
};
export const Variants: Story = {
  render: TableWithVariants,
  parameters: guide('Use the `variant` prop to change the appearance of the table.'),
};
export const Striped: Story = {
  render: TableWithStriped,
  parameters: guide('Use the `striped` prop to add zebra-stripes to the table.'),
};
export const Caption: Story = {
  render: TableWithCaption,
  parameters: guide('Use the `Table.Caption` component to add a caption to the table.'),
};
export const CaptionTop: Story = {
  render: TableWithCaptionTop,
  parameters: guide(
    'Use the `captionSide` prop on `Table.Caption` to position the caption at the top of the table.',
  ),
};
export const ColumnBorder: Story = {
  render: TableWithColumnBorder,
  parameters: guide('Use the `showColumnBorder` prop to add borders between columns.'),
};
export const Overflow: Story = {
  render: TableWithOverflow,
  parameters: guide('Render the `Table.ScrollArea` component to enable horizontal scrolling.'),
};
export const StickyHeader: Story = {
  render: TableWithStickyHeader,
  parameters: guide('Use the `stickyHeader` prop to make the table header sticky.'),
};
export const StickyColumn: Story = {
  render: TableWithStickyColumn,
  parameters: guide(
    "Here's an example what uses `data-sticky` attributes to make table columns sticky during horizontal scrolling.",
  ),
};
export const StickyHeaderAndColumn: Story = {
  render: TableWithStickyHeaderAndColumn,
  parameters: guide(
    'Combine `stickyHeader` with `data-sticky` attributes to create a table with both a sticky header and sticky columns. When using both features together, ensure the header row has a higher z-index to keep sticky column headers visible.',
  ),
};
export const Interactive: Story = {
  render: TableWithInteractive,
  parameters: guide('Use the `interactive` prop to highlight rows on hover.'),
};
export const Pagination: Story = {
  render: TableWithPagination,
  parameters: guide("Here's an example of how to compose a table with pagination."),
};
export const Selection: Story = {
  render: TableWithSelection,
  parameters: guide("Here's an example of how to add row selection with checkboxes to your table."),
};
export const SelectionActionBar: Story = {
  render: TableWithSelectionActionBar,
  parameters: guide(
    "Here's an example of how to compose a table with an action bar and checkboxes. This is useful for showing actions for selected table rows.",
  ),
};
export const ColumnGroup: Story = {
  render: TableWithColumnGroup,
  parameters: guide(
    'Use the `Table.ColumnGroup` component to distribute the column widths using the html `colgroup` element.',
    '> Set each width with the `htmlWidth` prop. Browsers apply only a few CSS properties to `col` elements.',
  ),
};
export const Native: Story = {
  render: TableWithNative,
  parameters: guide(
    "Use the `native` prop to render table descendants using native HTML elements (`<thead>`, `<tbody>`, `<tr>`, `<td>`, `<th>`) instead of Lever UI's styled components.",
    '> This is a great way to improve performance for large tables by eliminating the per-part components and Solid context overhead.',
  ),
};
export const Tanstack: Story = {
  render: TableWithTanstack,
  parameters: guide(
    'Lever UI works seamlessly with TanStack Table for advanced table features.',
    'See the [TanStack Table documentation](https://tanstack.com/table/latest) for its Solid adapter.',
  ),
};
export const SizeMatrix: Story = { render: TableSizeTable };
export const VariantMatrix: Story = { render: TableVariantTable };
