import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Collapsible } from '../src';
import './collapsible-provider.css';

/** Compare inherited defaults on owned and caller-owned Collapsible roots. */
function CollapsibleProviderStory(): JSX.Element {
  const [largePadding, setLargePadding] = createSignal(false);
  const machine = Collapsible.useCollapsible({ defaultOpen: false });

  /** Update the inherited root styling while keeping both machines mounted. */
  function increasePadding(): void {
    setLargePadding(true);
  }

  /** Read the current defaults for each nested root. */
  function readDefaults() {
    return {
      defaultOpen: true,
      class: largePadding() ? 'collapsible-pad-large' : 'collapsible-pad-small',
    };
  }

  return (
    <>
      <button type="button" onClick={increasePadding}>
        Increase inherited padding
      </button>
      <Collapsible.PropsProvider value={readDefaults}>
        <Collapsible.Root data-testid="collapsible-owned-root">
          <Collapsible.Trigger>Owned trigger</Collapsible.Trigger>
          <Collapsible.Content>Owned details</Collapsible.Content>
        </Collapsible.Root>
        <Collapsible.RootProvider value={machine} data-testid="collapsible-provider-root">
          <Collapsible.Trigger>Caller trigger</Collapsible.Trigger>
          <Collapsible.Content>Caller details</Collapsible.Content>
        </Collapsible.RootProvider>
      </Collapsible.PropsProvider>
    </>
  );
}

const meta = {
  title: 'Components/Collapsible Provider',
  component: CollapsibleProviderStory,
} satisfies Meta<typeof CollapsibleProviderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaults: Story = { render: CollapsibleProviderStory };
