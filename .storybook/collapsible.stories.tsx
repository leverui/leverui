import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Collapsible } from '../src';
import './collapsible.css';

/** Render the basic disclosure with its default closed state. */
function BasicCollapsibleStory(): JSX.Element {
  return (
    <>
      <Collapsible.Root data-testid="collapsible-root">
        <Collapsible.Trigger data-testid="collapsible-trigger">
          Toggle details{' '}
          <Collapsible.Indicator data-testid="collapsible-indicator">›</Collapsible.Indicator>
        </Collapsible.Trigger>
        <Collapsible.Content data-testid="collapsible-content">
          <div class="collapsible-story-panel">Disclosure details</div>
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
}

const meta = {
  title: 'Components/Collapsible',
  component: BasicCollapsibleStory,
} satisfies Meta<typeof BasicCollapsibleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: BasicCollapsibleStory };

/** Show the guide's initially open disclosure. */
function InitialOpenCollapsibleStory(): JSX.Element {
  return (
    <>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>Toggle initial content</Collapsible.Trigger>
        <Collapsible.Content data-testid="collapsible-initial-content">
          Initially visible details
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
}

export const InitialOpen: Story = { render: InitialOpenCollapsibleStory };

/** Keep a visible preview while the remainder is collapsed. */
function PartialHeightCollapsibleStory(): JSX.Element {
  return (
    <>
      <Collapsible.Root collapsedHeight="64px">
        <Collapsible.Content data-testid="collapsible-partial-content">
          <div class="collapsible-story-preview">
            Preview line
            <br />
            Additional details remain below the preview.
            <button type="button" data-testid="collapsible-preview-action">
              Preview action
            </button>
          </div>
        </Collapsible.Content>
        <Collapsible.Trigger>Toggle preview</Collapsible.Trigger>
      </Collapsible.Root>
    </>
  );
}

export const PartialHeight: Story = { render: PartialHeightCollapsibleStory };

/** Keep the disabled root from changing its open state. */
function DisabledCollapsibleStory(): JSX.Element {
  const [disabled, setDisabled] = createSignal(true);

  /** Enable the mounted disclosure to exercise a reactive machine prop. */
  function enableDisclosure(): void {
    setDisabled(false);
  }

  return (
    <>
      <button type="button" onClick={enableDisclosure}>
        Enable disclosure
      </button>
      <Collapsible.Root disabled={disabled()}>
        <Collapsible.Trigger data-testid="collapsible-disabled-trigger">
          Disabled toggle
        </Collapsible.Trigger>
        <Collapsible.Content data-testid="collapsible-disabled-content">
          Disabled details
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
}

export const Disabled: Story = { render: DisabledCollapsibleStory };

/** Mount content only while the primitive reports it visible. */
function LazyCollapsibleStory(): JSX.Element {
  return (
    <>
      <Collapsible.Root lazyMount unmountOnExit>
        <Collapsible.Trigger>Toggle lazy content</Collapsible.Trigger>
        <Collapsible.Content data-testid="collapsible-lazy-content">
          Lazily mounted details
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
}

export const LazyMounted: Story = { render: LazyCollapsibleStory };
