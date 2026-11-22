import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Image, Listbox, Stack, Text, createListCollection } from '../src';
import { renderHorizontalListbox } from './listbox-horizontal-tree';

const components = { Image, Listbox, Stack, Text, createListCollection };

/** Display the Horizontal Listbox with five album cards. */
function HorizontalExample() {
  return renderHorizontalListbox(components);
}

const meta = {
  title: 'Components/Listbox Horizontal',
  component: HorizontalExample,
} satisfies Meta<typeof HorizontalExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Guide: Story = { render: HorizontalExample };
