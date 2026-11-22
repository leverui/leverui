import type { Demo, DemoMeta } from './demo-types';
import './examples/data-list.css';
import {
  DataListBasic,
  DataListWithOrientation,
  DataListWithSeparator,
  DataListWithSizes,
  DataListWithVariants,
} from './examples/data-list-display';
import { DataListWithInfo } from './examples/data-list-info';
import { DataListSizeTable } from './examples/data-list-table';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: DataListBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: DataListBasic };
export const Sizes: Story = {
  render: DataListWithSizes,
  parameters: guide('Use the `size` prop to change the size of the datalist component.'),
};
export const SizeMatrix: Story = { render: DataListSizeTable };
export const Variants: Story = {
  render: DataListWithVariants,
  parameters: guide('Use the `variant` prop to change the variant of the datalist component.'),
};
export const Orientation: Story = {
  render: DataListWithOrientation,
  parameters: guide(
    'Use the `orientation` prop to change the orientation of the datalist component.',
  ),
};
export const Info: Story = {
  render: DataListWithInfo,
  parameters: guide(
    'Render an info tip within `DataList.Item` to provide additional context to the datalist.',
  ),
};
export const Separator: Story = {
  render: DataListWithSeparator,
  parameters: guide('Add a class on the `DataList.Root` to draw a separator between items.'),
};
