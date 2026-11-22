import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  FloatingPanelPropsProvider,
  FloatingPanelRoot,
  FloatingPanelRootProvider,
  FloatingPanelTrigger,
  useFloatingPanel,
} from '../src';

/** Exercise inherited, explicit, and externally owned machine defaults. */
function FloatingPanelDefaultsExample(): JSX.Element {
  const [disabled, setDisabled] = createSignal(true);
  const externalPanel = useFloatingPanel({ disabled: false });

  /** Change the inherited default without recreating any panel root. */
  function toggleDisabled(): void {
    setDisabled(
      /** Flip the current provider default for every owned descendant. */
      (current) => !current,
    );
  }

  return (
    <>
      <FloatingPanelPropsProvider
        value={
          /** Supply a changing machine default to owned panel roots. */
          () => ({ disabled: disabled() })
        }
      >
        <FloatingPanelRoot>
          <FloatingPanelTrigger data-testid="floating-inherited-trigger">
            Inherited panel
          </FloatingPanelTrigger>
        </FloatingPanelRoot>
        <FloatingPanelRoot disabled={false}>
          <FloatingPanelTrigger data-testid="floating-explicit-trigger">
            Explicit panel
          </FloatingPanelTrigger>
        </FloatingPanelRoot>
        <FloatingPanelRootProvider value={externalPanel}>
          <FloatingPanelTrigger data-testid="floating-external-trigger">
            External panel
          </FloatingPanelTrigger>
        </FloatingPanelRootProvider>
      </FloatingPanelPropsProvider>
      <button type="button" data-testid="floating-toggle-default" onClick={toggleDisabled}>
        Toggle inherited default
      </button>
    </>
  );
}

const meta = {
  title: 'Components/Floating Panel Defaults',
  component: FloatingPanelDefaultsExample,
} satisfies Meta<typeof FloatingPanelDefaultsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
