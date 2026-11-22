import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';

/** Exercise Solid rendering and reactivity in Storybook. */
function BrowserSmoke(): JSX.Element {
  const [count, setCount] = createSignal(0);

  /** Increment the visible counter after a browser click. */
  function increment(): void {
    setCount((value) => value + 1);
  }

  return <button onClick={increment}>Clicks: {count()}</button>;
}

const meta = {
  title: 'Setup/Browser Smoke',
  component: BrowserSmoke,
} satisfies Meta<typeof BrowserSmoke>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {};
