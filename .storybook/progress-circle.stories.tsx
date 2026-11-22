import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ProgressCircleContractExample } from './progress-circle-contract-example';

const meta = {
  title: 'Feedback/Progress Circle',
  component: ProgressCircleContractExample,
} satisfies Meta<typeof ProgressCircleContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
