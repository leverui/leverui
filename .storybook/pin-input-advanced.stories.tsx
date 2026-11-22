import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  Field,
  PinInput,
  type PinInputValueChangeDetails,
  type PinInputValueInvalidDetails,
} from '../src';

/** Read controlled value changes through a caller-owned Solid signal. */
function ControlledExample(): JSX.Element {
  const [value, setValue] = createSignal(['', '', '', '']);
  const [changes, setChanges] = createSignal(0);

  /** Write the primitive's new code back to the controlling signal. */
  function updateValue(details: PinInputValueChangeDetails): void {
    setValue(details.value);
    setChanges(
      /** Count each controlled value-change notification. */
      (count) => count + 1,
    );
  }

  return (
    <>
      <PinInput.Root count={4} value={value()} onValueChange={updateValue} name="controlled-code">
        <PinInput.HiddenInput />
        <PinInput.Control>
          <PinInput.Input index={0} data-testid="controlled-pin-0" />
          <PinInput.Input index={1} data-testid="controlled-pin-1" />
          <PinInput.Input index={2} data-testid="controlled-pin-2" />
          <PinInput.Input index={3} data-testid="controlled-pin-3" />
        </PinInput.Control>
      </PinInput.Root>
      <output data-testid="controlled-code">{value().join('')}</output>
      <output data-testid="controlled-changes">{changes()}</output>
    </>
  );
}

/** Exercise masking, OTP metadata, sanitization, and invalid callbacks. */
function OptionsExample(): JSX.Element {
  const [invalidValue, setInvalidValue] = createSignal('');

  /** Remove separators before the machine validates pasted code. */
  function normalizeValue(value: string): string {
    return value.replace(/\D/g, '');
  }

  /** Expose a rejected character to the browser assertion. */
  function recordInvalid(details: PinInputValueInvalidDetails): void {
    setInvalidValue(details.value);
  }

  return (
    <>
      <PinInput.Root
        count={4}
        mask
        otp
        name="secret-code"
        normalizeValue={normalizeValue}
        onValueInvalid={recordInvalid}
      >
        <PinInput.Label data-testid="options-label">Secret code</PinInput.Label>
        <PinInput.HiddenInput />
        <PinInput.Control>
          <PinInput.Input index={0} data-testid="options-pin-0" />
          <PinInput.Input index={1} data-testid="options-pin-1" />
          <PinInput.Input index={2} data-testid="options-pin-2" />
          <PinInput.Input index={3} data-testid="options-pin-3" />
        </PinInput.Control>
      </PinInput.Root>
      <output data-testid="options-invalid">{invalidValue()}</output>
    </>
  );
}

/** Compose Pin Input with Field descriptions and reactive form states. */
function FieldExample(): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);
  const [readOnly, setReadOnly] = createSignal(false);
  const [required, setRequired] = createSignal(true);

  /** Change Field state without replacing its Pin Input machine. */
  function toggleFieldState(): void {
    setInvalid(!invalid());
    setReadOnly(!readOnly());
    setRequired(!required());
  }

  return (
    <>
      <Field.Root invalid={invalid()} readOnly={readOnly()} required={required()}>
        <Field.Label data-testid="field-pin-label">Field code</Field.Label>
        <PinInput.Root count={4} name="field-code">
          <PinInput.HiddenInput data-testid="field-pin-hidden" />
          <PinInput.Context>
            {
              /** Show the machine's current read-only state beside its DOM fields. */
              (api) => (
                <output hidden data-testid="field-pin-machine-readonly">
                  {String(api().getRootState().readOnly)}
                </output>
              )
            }
          </PinInput.Context>
          <PinInput.Control>
            <PinInput.Input index={0} data-testid="field-pin-0" />
            <PinInput.Input
              index={1}
              asChild={
                /** Keep caller-rendered inputs under the same reactive machine. */
                (getProps) => <input {...getProps({})} data-testid="field-pin-1" />
              }
            />
            <PinInput.Input index={2} data-testid="field-pin-2" />
            <PinInput.Input index={3} data-testid="field-pin-3" />
          </PinInput.Control>
        </PinInput.Root>
        <Field.HelperText data-testid="field-pin-help">Enter your code</Field.HelperText>
        <Field.ErrorText data-testid="field-pin-error">Code is invalid</Field.ErrorText>
      </Field.Root>
      <button type="button" onClick={toggleFieldState} data-testid="field-pin-toggle">
        Toggle Pin Input field state
      </button>
    </>
  );
}

/** Exercise native form submission after the final indexed field is filled. */
function AutoSubmitExample(): JSX.Element {
  const [submissions, setSubmissions] = createSignal(0);

  /** Count a machine-triggered native submit without navigating away. */
  function recordSubmit(event: SubmitEvent): void {
    event.preventDefault();
    setSubmissions(
      /** Count native submits triggered by the Pin Input machine. */
      (count) => count + 1,
    );
  }

  return (
    <>
      <form onSubmit={recordSubmit}>
        <PinInput.Root count={4} name="auto-code" autoSubmit>
          <PinInput.HiddenInput />
          <PinInput.Control>
            <PinInput.Input index={0} data-testid="auto-pin-0" />
            <PinInput.Input index={1} data-testid="auto-pin-1" />
            <PinInput.Input index={2} data-testid="auto-pin-2" />
            <PinInput.Input index={3} data-testid="auto-pin-3" />
          </PinInput.Control>
        </PinInput.Root>
        <output data-testid="auto-submissions">{submissions()}</output>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Pin Input Advanced',
  component: ControlledExample,
} satisfies Meta<typeof ControlledExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Controlled: Story = {};
export const MachineOptions: Story = { render: OptionsExample };
export const FieldComposition: Story = { render: FieldExample };
export const AutoSubmit: Story = { render: AutoSubmitExample };
