import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Code, Listbox, Stack, createListCollection } from '../src';
import { renderListboxStateGuide } from './listbox-state-guide-tree';

const components = { Code, Listbox, Stack, createListCollection };

/** Show the basic Listbox root. */
function BasicExample() {
  return renderListboxStateGuide(components, 'basic');
}

/** Show caller-controlled Listbox selection. */
function ControlledExample() {
  return renderListboxStateGuide(components, 'controlled');
}

/** Show a caller-owned Listbox store through RootProvider. */
function StoreExample() {
  return renderListboxStateGuide(components, 'store');
}

const meta = {
  title: 'Components/Listbox State Guide',
  component: BasicExample,
} satisfies Meta<typeof BasicExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { render: BasicExample };
export const Controlled: Story = { render: ControlledExample };
export const Store: Story = { render: StoreExample };
