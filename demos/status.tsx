import type { Demo, DemoMeta } from './demo-types';
import { StatusBasic, StatusWithLabel, StatusWithSizes } from './examples/status-display';
import { StatusSizeTable } from './examples/status-table';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: StatusBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: StatusBasic };
export const Label: Story = {
  render: StatusWithLabel,
  parameters: {
    guide: { description: 'Render the label within the `Status.Root` component.' },
  },
};
export const Sizes: Story = {
  render: StatusWithSizes,
  parameters: {
    guide: {
      description: 'Use the `size` prop to change the size of the status component.',
    },
  },
};
export const SizeMatrix: Story = { name: 'SizeMatrix', render: StatusSizeTable };
