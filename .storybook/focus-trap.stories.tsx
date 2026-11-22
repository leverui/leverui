import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { FocusTrap } from '../src';

/** Exercise activation, autofocus, tab containment, and focus restoration. */
function FocusTrapExample(): JSX.Element {
  const [active, setActive] = createSignal(false);
  const [activations, setActivations] = createSignal(0);
  const [deactivations, setDeactivations] = createSignal(0);

  /** Activate the existing trap without replacing its DOM node. */
  function startTrap(): void {
    setActive(true);
  }

  /** Release focus and restore the launcher. */
  function endTrap(): void {
    setActive(false);
  }

  /** Count Zag's activation callback. */
  function recordActivation(): void {
    setActivations(
      /** Add this activation to the visible callback count. */
      (current) => current + 1,
    );
  }

  /** Count Zag's deactivation callback. */
  function recordDeactivation(): void {
    setDeactivations(
      /** Add this deactivation to the visible callback count. */
      (current) => current + 1,
    );
  }

  return (
    <>
      <button type="button" data-testid="focus-trap-launcher" onClick={startTrap}>
        Start trap
      </button>
      <FocusTrap
        disabled={!active()}
        onActivate={recordActivation}
        onDeactivate={recordDeactivation}
        data-testid="focus-trap-root"
        data-custom="retained"
        style={{ padding: '17px' }}
      >
        <input aria-label="First trapped input" />
        <input aria-label="Autofocused input" data-autofocus />
        <button type="button" onClick={endTrap}>
          End trap
        </button>
      </FocusTrap>
      <button type="button" data-testid="focus-trap-outside">
        Outside trap
      </button>
      <output data-testid="focus-trap-active">{String(active())}</output>
      <output data-testid="focus-trap-activations">{activations()}</output>
      <output data-testid="focus-trap-deactivations">{deactivations()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Focus Trap',
  component: FocusTrapExample,
} satisfies Meta<typeof FocusTrapExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
