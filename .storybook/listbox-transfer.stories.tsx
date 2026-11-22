import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ListboxTransferExample } from './listbox-transfer-example';

const meta = {
  title: 'Components/Listbox Transfer',
  component: ListboxTransferExample,
} satisfies Meta<typeof ListboxTransferExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Guide: Story = { render: ListboxTransferExample };
