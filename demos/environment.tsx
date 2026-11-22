import type { Demo, DemoMeta } from './demo-types';
import { EnvironmentWithPortal } from './examples/environment-portal';
import { EnvironmentWithShadow } from './examples/environment-shadow';
import { EnvironmentWithSize } from './examples/environment-size';

export const meta = {
  component: EnvironmentWithPortal,
} satisfies DemoMeta;

type Story = Demo;

export const WithPortal: Story = { render: EnvironmentWithPortal };
export const WithSize: Story = { render: EnvironmentWithSize };
export const WithShadow: Story = { render: EnvironmentWithShadow };
