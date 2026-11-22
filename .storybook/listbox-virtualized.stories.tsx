import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Listbox, createListCollection } from '../src';
import { renderVirtualizedListbox } from './listbox-virtualized-tree';

/** Show the country guide with its full collection and bounded DOM window. */
function VirtualizedExample() {
  return renderVirtualizedListbox({ Listbox, createListCollection });
}

const meta = {
  title: 'Components/Listbox Virtualized',
  component: VirtualizedExample,
} satisfies Meta<typeof VirtualizedExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contract: Story = { render: VirtualizedExample };
