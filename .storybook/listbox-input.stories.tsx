import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ListboxFilterExample, ListboxKeyboardPriorityExample } from './listbox-input-example';

const meta = {
  title: 'Components/Listbox Input',
  component: ListboxFilterExample,
} satisfies Meta<typeof ListboxFilterExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filter: Story = { render: ListboxFilterExample };
export const KeyboardPriority: Story = { render: ListboxKeyboardPriorityExample };
