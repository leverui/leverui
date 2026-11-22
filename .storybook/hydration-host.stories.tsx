import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';

/** Provide a static same-origin page for server hydration browser checks. */
function HydrationHost(): JSX.Element {
  return <div data-testid="hydration-host">Hydration host</div>;
}

const meta = {
  title: 'Setup/Hydration Host',
  component: HydrationHost,
} satisfies Meta<typeof HydrationHost>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {};
