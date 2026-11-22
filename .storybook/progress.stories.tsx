import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ProgressContractExample } from './progress-contract-example';

const meta = {
  title: 'Feedback/Progress',
  component: ProgressContractExample,
} satisfies Meta<typeof ProgressContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
