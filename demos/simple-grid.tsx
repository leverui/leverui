import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  SimpleGridBasic,
  SimpleGridWithAutofit,
  SimpleGridWithColSpan,
  SimpleGridWithColumns,
  SimpleGridWithRowAndColGap,
} from './examples/simple-grid-columns';
import './simple-grid-examples.css';

export const meta = {
  component: SimpleGridBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: SimpleGridBasic };
export const AutoFit: Story = {
  name: 'AutoFit',
  render: SimpleGridWithAutofit,
  parameters: {
    guide: {
      description:
        'Make the grid responsive and adjust automatically without passing columns, by using the `minChildWidth` prop. This uses css grid auto-fit and minmax() internally.',
    },
  },
};
export const ColSpan: Story = {
  name: 'ColSpan',
  render: SimpleGridWithColSpan,
  parameters: {
    guide: {
      description: 'Specify the size of the column by using the `colSpan` prop.',
    },
  },
};
export const Columns: Story = {
  render: SimpleGridWithColumns,
  parameters: {
    guide: {
      description: 'Specify the number of columns for the grid layout using the `columns` prop.',
    },
  },
};
export const RowColGap: Story = {
  name: 'RowColGap',
  render: SimpleGridWithRowAndColGap,
  parameters: {
    guide: {
      description:
        'Set the `row-gap` and `column-gap` CSS properties to change the row and column spacing between the grid items.',
    },
  },
};
