import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Checkbox, Field, Fieldset } from '../src';

/** Exercise Checkbox context inheritance in real browser form structures. */
function CheckboxFieldCompositionExample(): JSX.Element {
  const [disabled, setDisabled] = createSignal(false);
  const [invalid, setInvalid] = createSignal(false);
  const [readOnly, setReadOnly] = createSignal(false);

  /** Change Fieldset and Group state without replacing their controls. */
  function toggleGroupState(): void {
    setDisabled(!disabled());
    setInvalid(!invalid());
  }

  /** Change the Group's read-only state independently of the Fieldset. */
  function toggleReadOnly(): void {
    setReadOnly(!readOnly());
  }

  return (
    <>
      <form data-testid="checkbox-context-form">
        <Fieldset.Root invalid={invalid()} disabled={disabled()} data-testid="topics-fieldset">
          <Fieldset.Legend>Choose topics</Fieldset.Legend>
          <Fieldset.HelperText>Select any available topic</Fieldset.HelperText>
          <Fieldset.Content>
            <Checkbox.Group name="topics" readOnly={readOnly()} data-testid="topics-group">
              <Checkbox.Root value="alpha">
                <Checkbox.Control />
                <Checkbox.Label>Alpha</Checkbox.Label>
                <Checkbox.HiddenInput />
              </Checkbox.Root>
              <Checkbox.Root value="beta" disabled>
                <Checkbox.Control />
                <Checkbox.Label>Beta</Checkbox.Label>
                <Checkbox.HiddenInput />
              </Checkbox.Root>
            </Checkbox.Group>
          </Fieldset.Content>
          <Fieldset.ErrorText>Choose another topic</Fieldset.ErrorText>
        </Fieldset.Root>
        <Field.Root id="terms-field" required invalid={invalid()} data-testid="terms-field">
          <Field.Label>Accept terms</Field.Label>
          <Checkbox.Root name="terms" value="yes" data-testid="terms-root">
            <Checkbox.Control />
            <Checkbox.HiddenInput />
          </Checkbox.Root>
          <Field.HelperText>Required before continuing</Field.HelperText>
          <Field.ErrorText>Accept the terms to continue</Field.ErrorText>
        </Field.Root>
      </form>
      <button type="button" onClick={toggleGroupState} data-testid="toggle-group-state">
        Toggle Fieldset state
      </button>
      <button type="button" onClick={toggleReadOnly} data-testid="toggle-group-readonly">
        Toggle Group read only
      </button>
    </>
  );
}

const meta = {
  title: 'Components/Checkbox Field Composition',
  component: CheckboxFieldCompositionExample,
} satisfies Meta<typeof CheckboxFieldCompositionExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
