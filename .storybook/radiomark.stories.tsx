import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RadiomarkContractExample } from './radiomark-contract-example';

const meta = {
  title: 'Feedback/Radiomark',
  component: RadiomarkContractExample,
} satisfies Meta<typeof RadiomarkContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
