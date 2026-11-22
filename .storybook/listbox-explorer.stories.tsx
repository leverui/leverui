import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Input, Listbox, useFilter, useListCollection } from '../src';
import { renderListboxExplorer } from './listbox-explorer-tree';

const components = { Box, Input, Listbox, useFilter, useListCollection };

/** Display the Explorer's grouped and filtered options. */
function ExplorerExample() {
  return renderListboxExplorer(components);
}

const meta = {
  title: 'Components/Listbox Explorer',
  component: ExplorerExample,
} satisfies Meta<typeof ExplorerExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Guide: Story = { render: ExplorerExample };
