import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { SkeletonContractExample } from './skeleton-contract-example';

const meta = {
  title: 'Feedback/Skeleton',
  component: SkeletonContractExample,
} satisfies Meta<typeof SkeletonContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
