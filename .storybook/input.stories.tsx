import { Field as PrimitiveField } from '../src/primitives/components/field';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Input, InputPropsProvider } from '../src';

/** Exercise native input state, the primitive Field composition, and authored CSS updates. */
function InputContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [value, setValue] = createSignal('first');
  const [notes, setNotes] = createSignal('controlled notes');
  const [invalid, setInvalid] = createSignal(false);
  const [events, setEvents] = createSignal(0);

  /** Track native input events while updating the controlled value. */
  function updateValue(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setValue(event.currentTarget.value);
    setEvents(events() + 1);
  }

  /** Keep the selected textarea controlled by its own native input event. */
  function updateNotes(event: InputEvent & { currentTarget: HTMLTextAreaElement }): void {
    setNotes(event.currentTarget.value);
  }

  /** Toggle appearance defaults and field validation without remounting inputs. */
  function toggleState(): void {
    setLarge(!large());
    setInvalid(!invalid());
  }

  /** Record the native input supplied to a consumer ref. */
  function markInput(element: HTMLInputElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  return (
    <>
      <div data-testid="input-contract">
        <form>
          <InputPropsProvider value={{ size: large() ? 'lg' : 'sm', variant: 'outline' }}>
            <PrimitiveField.Root id="email-field" invalid={invalid()} required>
              <PrimitiveField.Label>Email</PrimitiveField.Label>
              <Input
                type="email"
                ref={markInput}
                value={value()}
                onInput={updateValue}
                data-testid="controlled-input"
              />
              <PrimitiveField.HelperText>Use a valid address</PrimitiveField.HelperText>
              <PrimitiveField.ErrorText>Address is invalid</PrimitiveField.ErrorText>
            </PrimitiveField.Root>
            <Input aria-label="Draft name" defaultValue="draft" data-testid="uncontrolled-input" />
            <Input
              as="textarea"
              aria-label="Draft notes"
              defaultValue="notes draft"
              data-testid="uncontrolled-textarea"
            />
            <Input
              as="textarea"
              aria-label="Controlled notes"
              value={notes()}
              onInput={updateNotes}
              data-testid="controlled-textarea"
            />
            <Input aria-label="Disabled name" disabled data-testid="disabled-input" />
            <Input aria-label="Subtle name" variant="subtle" data-testid="subtle-input" />
            <Input aria-label="Flushed name" variant="flushed" data-testid="flushed-input" />
            <Input
              aria-label="Responsive name"
              size={{ base: 'sm', md: 'lg' }}
              variant={{ base: 'outline', md: 'subtle' }}
              data-testid="responsive-input"
            />
            <Input aria-label="Plain name" unstyled data-testid="unstyled-input" />
            <Input
              aria-label="Custom focus"
              style={{ '--leverui-input-focus-color': 'lime' }}
              data-testid="custom-focus-input"
            />
            <Input
              aria-label="Custom error"
              aria-invalid="true"
              style={{ '--leverui-input-error-color': 'green' }}
              data-testid="custom-error-input"
            />
          </InputPropsProvider>
          <button type="reset" data-testid="input-reset">
            Reset fields
          </button>
        </form>
        <button type="button" onClick={toggleState} data-testid="input-toggle">
          Toggle Input state
        </button>
        <output data-testid="input-events">{events()}</output>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Input',
  component: InputContractExample,
} satisfies Meta<typeof InputContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
