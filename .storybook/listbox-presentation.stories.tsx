import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  ListboxCheckmarkExample,
  ListboxDescriptionExample,
  ListboxIconExample,
} from './listbox-presentation-example';

const meta = {
  title: 'Components/Listbox Presentation',
  component: ListboxCheckmarkExample,
} satisfies Meta<typeof ListboxCheckmarkExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkmark: Story = { render: ListboxCheckmarkExample };
export const Description: Story = { render: ListboxDescriptionExample };
export const Icon: Story = { render: ListboxIconExample };
