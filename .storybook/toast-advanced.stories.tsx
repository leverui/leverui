import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ToastAdvancedExample } from './toast-advanced-example';
import {
  ToastEnvironmentExample,
  ToastReactiveEnvironmentExample,
} from './toast-environment-example';

const meta = {
  title: 'Feedback/Toast Advanced',
  component: ToastAdvancedExample,
  args: { placement: 'top-start', offsets: '24px' },
} satisfies Meta<typeof ToastAdvancedExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TopStart: Story = {};
export const TopEnd: Story = {
  args: {
    placement: 'top-end',
    offsets: { left: '12px', top: '28px', right: '36px', bottom: '44px' },
  },
};
export const BottomStart: Story = { args: { placement: 'bottom-start' } };
export const BottomEnd: Story = { args: { placement: 'bottom-end' } };
export const Overlapping: Story = {
  args: { placement: 'top-end', overlap: true },
};
export const Closable: Story = { args: { placement: 'top-end', closable: true } };
export const NotClosable: Story = { args: { placement: 'top-end', closable: false } };
export const IdlePauses: Story = {
  args: { placement: 'bottom-end', duration: 800, pauseOnPageIdle: true },
};
export const IdleContinues: Story = {
  args: { placement: 'bottom-end', duration: 800, pauseOnPageIdle: false },
};

export const CustomDocument: Story = { render: ToastEnvironmentExample };
export const ReactiveDocument: Story = { render: ToastReactiveEnvironmentExample };
