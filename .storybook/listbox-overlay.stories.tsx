import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DialogListboxExample } from './listbox-dialog-example';
import { PopoverListboxExample } from './listbox-popover-example';

const meta = {
  title: 'Components/Listbox Overlay',
  component: DialogListboxExample,
} satisfies Meta<typeof DialogListboxExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DialogComposition: Story = { render: DialogListboxExample };
export const PopoverComposition: Story = { render: PopoverListboxExample };
