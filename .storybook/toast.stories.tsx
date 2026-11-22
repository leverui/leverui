import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ToastContractExample } from './toast-contract-example';
import { ToastLifecycleExample } from './toast-lifecycle-example';

const meta = {
  title: 'Feedback/Toast',
  component: ToastContractExample,
} satisfies Meta<typeof ToastContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};

/** Exercise loading, promise, timer, status, and queue behavior. */
export const Lifecycle: Story = { render: ToastLifecycleExample };
