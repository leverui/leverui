import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Fieldset, useFieldset, useFieldsetContext } from '../src';

/** Exercise caller-owned Fieldset state through a real browser composition. */
function FieldsetProviderExample(): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);
  const fieldset = useFieldset(
    /** Read changing state through the public accessor API. */
    () => ({ id: 'provider-group', invalid: invalid(), disabled: disabled() }),
  );

  /** Mark the native root delivered through its consumer callback ref. */
  function captureRoot(element: HTMLFieldSetElement): void {
    element.dataset.refReceived = 'root';
  }

  /** Mark the legend delivered through its consumer callback ref. */
  function captureLegend(element: HTMLLegendElement): void {
    element.dataset.refReceived = 'legend';
  }

  /** Expose the nearest hook state inside the caller-owned provider. */
  function ContextReader(): JSX.Element {
    const context = useFieldsetContext();
    return (
      <output data-testid="provider-hook-state">{`${context().invalid}:${context().disabled}`}</output>
    );
  }

  /** Exercise both directions of validation and disabled state. */
  function toggleState(): void {
    setInvalid(!invalid());
    setDisabled(!disabled());
  }

  return (
    <>
      <Fieldset.RootProvider value={fieldset} ref={captureRoot} data-testid="provider-fieldset">
        <Fieldset.Legend ref={captureLegend} data-testid="provider-legend">
          Provider group
        </Fieldset.Legend>
        <Fieldset.HelperText>Provider guidance</Fieldset.HelperText>
        <Fieldset.Content>
          <input data-testid="provider-input" />
        </Fieldset.Content>
        <Fieldset.ErrorText>Provider error</Fieldset.ErrorText>
        <Fieldset.Context>
          {/** Render the public context callback's changing state. */}
          {(context) => (
            <output data-testid="provider-render-state">
              {`${context().invalid}:${context().disabled}`}
            </output>
          )}
        </Fieldset.Context>
        <ContextReader />
      </Fieldset.RootProvider>
      <button type="button" onClick={toggleState} data-testid="provider-toggle">
        Toggle provider state
      </button>
    </>
  );
}

const meta = {
  title: 'Components/Fieldset Provider',
  component: FieldsetProviderExample,
} satisfies Meta<typeof FieldsetProviderExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
