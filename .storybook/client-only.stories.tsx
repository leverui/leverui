import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ClientOnly } from '../src';

/** Exercise deferred browser access, direct children, and reactive content. */
function ClientOnlyContractExample(): JSX.Element {
  const [count, setCount] = createSignal(0);

  /** Update the mounted render-function child without replacing it. */
  function increment(): void {
    setCount(count() + 1);
  }

  /** Read a browser-only API after ClientOnly has mounted. */
  function renderBrowserContent(): JSX.Element {
    return (
      <button type="button" data-testid="client-only-button" onClick={increment}>
        {window.location.pathname}: {count()}
      </button>
    );
  }

  return (
    <div data-testid="client-only-contract">
      <ClientOnly
        fallback={<span data-testid="client-only-fallback">Loading browser content</span>}
      >
        {renderBrowserContent}
      </ClientOnly>
      <ClientOnly>
        <span data-testid="client-only-direct">Direct child</span>
      </ClientOnly>
    </div>
  );
}

const meta = {
  title: 'Components/ClientOnly',
  component: ClientOnlyContractExample,
} satisfies Meta<typeof ClientOnlyContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
