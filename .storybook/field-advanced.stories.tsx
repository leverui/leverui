import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Field, Input, useField } from '../src';

/** Exercise target controls, reactive defaults, and an external Field root. */
function FieldAdvancedExample(): JSX.Element {
  const [required, setRequired] = createSignal(false);
  const [invalid, setInvalid] = createSignal(false);
  const external = useField(
    /** Keep the caller-owned field's validation live. */
    () => ({ id: 'external-browser', invalid: invalid() }),
  );

  /** Change provider and external field state without remounting controls. */
  function toggleState(): void {
    setRequired(!required());
    setInvalid(!invalid());
  }

  return (
    <>
      <Field.Root id="price" target="amount" data-testid="target-root">
        <Field.Label>Price</Field.Label>
        <Field.Item value="currency">
          <Input aria-label="Currency" defaultValue="USD" data-testid="currency-input" />
        </Field.Item>
        <Field.Item value="amount">
          <Input type="number" data-testid="amount-input" />
        </Field.Item>
      </Field.Root>
      <Field.PropsProvider
        value={
          /** Apply changing required and validation defaults. */
          () => ({ required: required(), invalid: invalid() })
        }
      >
        <Field.Root id="provider-browser" data-testid="provider-root">
          <Field.Label>
            Provider <Field.RequiredIndicator fallback="Optional" />
          </Field.Label>
          <Input data-testid="provider-input" />
          <Field.ErrorText>Provider error</Field.ErrorText>
        </Field.Root>
      </Field.PropsProvider>
      <Field.RootProvider value={external} data-testid="external-root">
        <Field.Label>External</Field.Label>
        <Input data-testid="external-input" />
        <Field.HelperText>External help</Field.HelperText>
        <Field.ErrorText>External error</Field.ErrorText>
      </Field.RootProvider>
      <button type="button" onClick={toggleState} data-testid="advanced-toggle">
        Toggle defaults
      </button>
    </>
  );
}

const meta = {
  title: 'Components/Field Advanced',
  component: FieldAdvancedExample,
} satisfies Meta<typeof FieldAdvancedExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
