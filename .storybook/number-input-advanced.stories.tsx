import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Field, NumberInput } from '../src';

/** Exercise caller-owned value updates through the public Number Input parts. */
function ControlledExample(): JSX.Element {
  const [value, setValue] = createSignal<number | null>(2);
  const [changes, setChanges] = createSignal(0);

  /** Write the machine's number back to the caller's signal. */
  function updateValue(details: { value: number | null }): void {
    setValue(details.value);
    setChanges((count) => count + 1);
  }

  return (
    <>
      <NumberInput.Root value={value()} onValueChange={updateValue} min={0} max={10}>
        <NumberInput.Label>Controlled quantity</NumberInput.Label>
        <NumberInput.Input data-testid="controlled-input" />
        <NumberInput.IncrementTrigger data-testid="controlled-increment" />
        <NumberInput.ValueText data-testid="controlled-value" />
      </NumberInput.Root>
      <output data-testid="controlled-changes">{changes()}</output>
    </>
  );
}

/** Exercise Number Input's composition with Field state and descriptions. */
function FieldExample(): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);
  const [readOnly, setReadOnly] = createSignal(false);
  const [required, setRequired] = createSignal(true);

  /** Toggle the Field states without remounting its numeric input. */
  function toggleFieldState(): void {
    setInvalid(!invalid());
    setReadOnly(!readOnly());
    setRequired(!required());
  }

  return (
    <>
      <Field.Root
        invalid={invalid()}
        readOnly={readOnly()}
        required={required()}
        data-testid="field-root"
      >
        <Field.Label>Field quantity</Field.Label>
        <NumberInput.Root defaultValue={3} min={0} max={10}>
          <NumberInput.Input data-testid="field-number-input" />
          <NumberInput.Control />
        </NumberInput.Root>
        <Field.HelperText>Choose a quantity</Field.HelperText>
        <Field.ErrorText>Quantity is invalid</Field.ErrorText>
      </Field.Root>
      <button type="button" onClick={toggleFieldState} data-testid="field-toggle">
        Toggle field state
      </button>
    </>
  );
}

/** Exercise formatting, blur clamping, wheel stepping, and pointer scrubbing. */
function OptionsExample(): JSX.Element {
  return (
    <>
      <NumberInput.Root
        defaultValue={2}
        min={0}
        max={10}
        step={1}
        allowMouseWheel
        formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
      >
        <NumberInput.Label>Formatted quantity</NumberInput.Label>
        <NumberInput.Input data-testid="options-input" />
        <NumberInput.Scrubber data-testid="options-scrubber">Drag</NumberInput.Scrubber>
        <NumberInput.ValueText data-testid="options-value" />
      </NumberInput.Root>
      <button type="button" data-testid="options-blur">
        Blur target
      </button>
    </>
  );
}

/** Compare an ordinary uncontrolled input with the hydrated child path. */
function UncontrolledExample(): JSX.Element {
  return (
    <>
      <NumberInput.Root defaultValue={3} min={0} max={10}>
        <NumberInput.Input data-testid="uncontrolled-input" />
        <NumberInput.IncrementTrigger data-testid="uncontrolled-increment" />
        <NumberInput.ValueText data-testid="uncontrolled-value" />
      </NumberInput.Root>
    </>
  );
}

/** Exercise an input supplied through the primitive's caller-rendered child path. */
function ChildInputExample(): JSX.Element {
  return (
    <>
      <NumberInput.Root defaultValue={3} min={0} max={10}>
        <NumberInput.Input
          asChild={
            /** Keep the primitive's input attributes on the caller's native element. */
            (getProps) => <input {...getProps({})} data-testid="child-example-input" />
          }
        />
        <NumberInput.IncrementTrigger data-testid="child-example-increment" />
        <NumberInput.ValueText data-testid="child-example-value" />
      </NumberInput.Root>
    </>
  );
}

const meta = {
  title: 'Components/Number Input Advanced',
  component: ControlledExample,
} satisfies Meta<typeof ControlledExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Controlled: Story = {};
export const FieldComposition: Story = { render: FieldExample };
export const MachineOptions: Story = { render: OptionsExample };
export const Uncontrolled: Story = { render: UncontrolledExample };
export const ChildInput: Story = { render: ChildInputExample };
