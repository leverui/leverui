import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Collapsible } from '../src';
import './collapsible-lifecycle.css';

/** Render a primitive width preview through Lever UI's public root. */
function WidthPreviewStory(): JSX.Element {
  return (
    <>
      <Collapsible.Root collapsedWidth="72px">
        <Collapsible.Trigger>Toggle width preview</Collapsible.Trigger>
        <Collapsible.Content data-testid="collapsible-width-content">
          <div class="collapsible-width-preview">Wide preview content</div>
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
}

/** Expose exit notifications alongside the mounted content lifecycle. */
function ExitCompletionStory(): JSX.Element {
  const [exits, setExits] = createSignal(0);

  /** Count completed exit animations from the public root callback. */
  function recordExit(): void {
    setExits(
      /** Advance the visible count after one completed close. */
      (count) => count + 1,
    );
  }

  return (
    <>
      <output data-testid="collapsible-exit-count">{exits()}</output>
      <Collapsible.Root lazyMount unmountOnExit onExitComplete={recordExit}>
        <Collapsible.Trigger>Toggle exiting content</Collapsible.Trigger>
        <Collapsible.Content class="collapsible-slow-exit" data-testid="collapsible-exit-content">
          Exiting details
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
}

const meta = {
  title: 'Components/Collapsible Lifecycle',
  component: ExitCompletionStory,
} satisfies Meta<typeof ExitCompletionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WidthPreview: Story = { render: WidthPreviewStory };
export const ExitCompletion: Story = { render: ExitCompletionStory };
