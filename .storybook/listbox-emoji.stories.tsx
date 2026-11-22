import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ListboxEmojiExample } from './listbox-emoji-example';

const meta = {
  title: 'Components/Listbox Emoji Grid',
  component: ListboxEmojiExample,
} satisfies Meta<typeof ListboxEmojiExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Guide: Story = { render: ListboxEmojiExample };
