import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Listbox, createListCollection } from '../src';
import { renderListboxCollectionGuide } from './listbox-collection-guide-tree';

const components = { Listbox, createListCollection };

/** Show disabled options without removing them from the collection. */
function DisabledExample() {
  return renderListboxCollectionGuide(components, 'disabled');
}

/** Show collection groups with their machine-owned labels. */
function GroupedExample() {
  return renderListboxCollectionGuide(components, 'grouped');
}

/** Show the additive selection mode. */
function MultipleExample() {
  return renderListboxCollectionGuide(components, 'multiple');
}

const meta = {
  title: 'Components/Listbox Collection Guide',
  component: DisabledExample,
} satisfies Meta<typeof DisabledExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Disabled: Story = { render: DisabledExample };
export const Grouped: Story = { render: GroupedExample };
export const Multiple: Story = { render: MultipleExample };
