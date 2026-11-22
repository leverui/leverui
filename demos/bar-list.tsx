import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  BarListAscending,
  BarListBasic,
  BarListFormatter,
  BarListLink,
} from './examples/bar-list-basic';
import { BarListMultiValue, BarListTooltip, BarListWithLabel } from './examples/bar-list-labels';

export const meta = {
  component: BarListBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Ascending: Story = { render: BarListAscending };
export const Basic: Story = { render: BarListBasic };
export const Formatter: Story = { render: BarListFormatter };
export const Label: Story = { render: BarListWithLabel };
export const Link: Story = { render: BarListLink };
export const MultiValue: Story = { render: BarListMultiValue };
export const Tooltip: Story = { render: BarListTooltip };
