import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Field, Input } from '../src';

/** Show required, invalid, disabled, and horizontal Field compositions. */
function FieldContractExample(): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);
  const [horizontal, setHorizontal] = createSignal(false);

  /** Toggle validation and the root's orientation. */
  function toggleField(): void {
    setInvalid(!invalid());
    setHorizontal(!horizontal());
  }

  return (
    <>
      <div data-testid="field-contract">
        <Field.Root
          id="email"
          required
          invalid={invalid()}
          orientation={horizontal() ? 'horizontal' : 'vertical'}
          data-testid="field-root"
        >
          <Field.Label>
            Email <Field.RequiredIndicator />
          </Field.Label>
          <Input type="email" data-testid="field-input" />
          <Field.HelperText>Use a working address</Field.HelperText>
          <Field.ErrorText>
            <Field.ErrorIcon /> Enter a valid address
          </Field.ErrorText>
        </Field.Root>
        <Field.Root id="readonly" readOnly>
          <Field.Label>
            Reference <Field.RequiredIndicator fallback="Optional" />
          </Field.Label>
          <Input defaultValue="Draft" data-testid="readonly-input" />
        </Field.Root>
        <Field.Root id="disabled" disabled>
          <Field.Label>Unavailable</Field.Label>
          <Input data-testid="disabled-input" />
        </Field.Root>
        <button type="button" onClick={toggleField} data-testid="field-toggle">
          Toggle Field state
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Field',
  component: FieldContractExample,
} satisfies Meta<typeof FieldContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
