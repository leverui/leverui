import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ListboxImageExplorerExample } from './listbox-image-explorer-example';

const meta = {
  title: 'Components/Listbox Image Explorer',
  component: ListboxImageExplorerExample,
} satisfies Meta<typeof ListboxImageExplorerExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Explorer: Story = { render: ListboxImageExplorerExample };
