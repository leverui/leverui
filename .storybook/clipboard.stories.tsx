import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Clipboard } from '../src';
import './clipboard.css';

/** Exercise native input, button, icon, and status text composition. */
function BasicClipboardStory(): JSX.Element {
  return (
    <>
      <Clipboard.Root value="https://leverui.com" timeout={1000} data-testid="clipboard-root">
        <Clipboard.Label>Project link</Clipboard.Label>
        <Clipboard.Control>
          <Clipboard.Input data-testid="clipboard-input" />
          <Clipboard.Trigger data-testid="clipboard-trigger">
            <Clipboard.Indicator data-testid="clipboard-indicator" />
            <Clipboard.CopyText data-testid="clipboard-copy-text" />
          </Clipboard.Trigger>
        </Clipboard.Control>
        <Clipboard.ValueText data-testid="clipboard-value" />
      </Clipboard.Root>
    </>
  );
}

const meta = {
  title: 'Components/Clipboard',
  component: BasicClipboardStory,
} satisfies Meta<typeof BasicClipboardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: BasicClipboardStory };

/** Keep the machine's value synchronized with an external Solid signal. */
function ControlledClipboardStory(): JSX.Element {
  const [value, setValue] = createSignal('First value');

  /** Change the copied value without remounting the Clipboard. */
  function updateValue(): void {
    setValue('Second value');
  }

  return (
    <>
      <button type="button" onClick={updateValue}>
        Update Clipboard value
      </button>
      <Clipboard.Root value={value()}>
        <Clipboard.ValueText data-testid="clipboard-controlled-value" />
        <Clipboard.Input data-testid="clipboard-controlled-input" />
        <Clipboard.Trigger data-testid="clipboard-controlled-trigger">
          <Clipboard.CopyText />
        </Clipboard.Trigger>
      </Clipboard.Root>
    </>
  );
}

export const Controlled: Story = { render: ControlledClipboardStory };

/** Preserve caller-owned primitive state under reactive presentation defaults. */
function ProviderClipboardStory(): JSX.Element {
  const [largePadding, setLargePadding] = createSignal(false);
  const machine = Clipboard.useClipboard({ value: 'Caller-owned value' });

  /** Change inherited styles while the external machine remains mounted. */
  function increasePadding(): void {
    setLargePadding(true);
  }

  /** Read the current provider defaults for both root modes. */
  function readDefaults() {
    return {
      value: 'Provider default value',
      class: largePadding() ? 'clipboard-pad-large' : 'clipboard-pad-small',
    };
  }

  return (
    <>
      <button type="button" onClick={increasePadding}>
        Increase Clipboard padding
      </button>
      <Clipboard.PropsProvider value={readDefaults}>
        <Clipboard.Root data-testid="clipboard-owned-root">
          <Clipboard.ValueText data-testid="clipboard-owned-value" />
        </Clipboard.Root>
        <Clipboard.RootProvider value={machine} data-testid="clipboard-provider-root">
          <Clipboard.ValueText data-testid="clipboard-provider-value" />
          <Clipboard.Trigger data-testid="clipboard-provider-trigger">
            Copy external
          </Clipboard.Trigger>
        </Clipboard.RootProvider>
      </Clipboard.PropsProvider>
    </>
  );
}

export const Provider: Story = { render: ProviderClipboardStory };

/** Keep the primitive copying available without a runtime styling wrapper or family CSS. */
function UnstyledClipboardStory(): JSX.Element {
  return (
    <Clipboard.Root unstyled value="Unstyled copy value" data-testid="clipboard-unstyled-root">
      <Clipboard.Trigger data-testid="clipboard-unstyled-trigger">
        <Clipboard.Indicator data-testid="clipboard-unstyled-indicator" />
      </Clipboard.Trigger>
    </Clipboard.Root>
  );
}

export const Unstyled: Story = { render: UnstyledClipboardStory };
