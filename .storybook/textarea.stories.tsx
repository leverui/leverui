import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Field, Textarea, TextareaPropsProvider } from '../src';

/** Exercise Field state, native values, provider defaults, and autoresize. */
function TextareaContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [invalid, setInvalid] = createSignal(false);
  const [readOnly, setReadOnly] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);
  const [autoResize, setAutoResize] = createSignal(true);
  const [selectedInput, setSelectedInput] = createSignal(false);
  const [customHeight, setCustomHeight] = createSignal('');
  const [value, setValue] = createSignal('First note');
  const [events, setEvents] = createSignal(0);

  /** Keep controlled text aligned with the native input event. */
  function updateValue(event: InputEvent & { currentTarget: HTMLTextAreaElement }): void {
    setValue(event.currentTarget.value);
    setEvents(events() + 1);
  }

  /** Change the shared CSS size and Field validation state. */
  function toggleState(): void {
    setLarge(!large());
    setInvalid(!invalid());
  }

  /** Toggle the Field's native read-only state without remounting it. */
  function toggleReadOnly(): void {
    setReadOnly(!readOnly());
  }

  /** Toggle the Field's native disabled state without remounting it. */
  function toggleDisabled(): void {
    setDisabled(!disabled());
  }

  /** Toggle Zag-backed automatic sizing on the same native textarea. */
  function toggleAutoresize(): void {
    setAutoResize(!autoResize());
  }

  /** Replace the native textarea with an input and then restore it. */
  function toggleSelectedElement(): void {
    setSelectedInput(!selectedInput());
  }

  /** Change authored inline sizing while Zag controls the same element. */
  function toggleCustomHeight(): void {
    setCustomHeight(customHeight() ? '' : '96px');
  }

  /** Expose the actual ref target for browser assertions. */
  function markControl(element: HTMLTextAreaElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  return (
    <>
      <form data-testid="textarea-contract">
        <TextareaPropsProvider value={{ size: large() ? 'lg' : 'sm', variant: 'outline' }}>
          <Field.Root
            id="notes-field"
            invalid={invalid()}
            readOnly={readOnly()}
            disabled={disabled()}
            required
          >
            <Field.Label>Notes</Field.Label>
            <Textarea
              ref={markControl}
              value={value()}
              onInput={updateValue}
              data-testid="controlled-textarea"
            />
            <Field.HelperText>Describe the issue</Field.HelperText>
            <Field.ErrorText>Notes are required</Field.ErrorText>
          </Field.Root>
          <Textarea
            aria-label="Draft notes"
            defaultValue="Draft note"
            data-testid="draft-textarea"
          />
          <Textarea
            aria-label="Expanding notes"
            autoresize={autoResize()}
            rows={2}
            style={{ height: customHeight() }}
            data-testid="autoresize-textarea"
          />
          <Textarea
            as={selectedInput() ? 'input' : 'textarea'}
            aria-label="Swappable notes"
            autoresize
            data-testid="swappable-textarea"
          />
          <Textarea aria-label="Subtle notes" variant="subtle" data-testid="subtle-textarea" />
          <Textarea aria-label="Flushed notes" variant="flushed" data-testid="flushed-textarea" />
          <Textarea aria-label="Disabled notes" disabled data-testid="disabled-textarea" />
        </TextareaPropsProvider>
        <button type="reset" data-testid="textarea-reset">
          Reset notes
        </button>
      </form>
      <button type="button" onClick={toggleState} data-testid="textarea-toggle">
        Toggle Textarea state
      </button>
      <button type="button" onClick={toggleReadOnly} data-testid="textarea-readonly-toggle">
        Toggle read-only
      </button>
      <button type="button" onClick={toggleDisabled} data-testid="textarea-disabled-toggle">
        Toggle disabled
      </button>
      <button type="button" onClick={toggleAutoresize} data-testid="textarea-autoresize-toggle">
        Toggle autoresize
      </button>
      <button type="button" onClick={toggleSelectedElement} data-testid="textarea-element-toggle">
        Toggle native element
      </button>
      <button type="button" onClick={toggleCustomHeight} data-testid="textarea-height-toggle">
        Toggle authored height
      </button>
      <output data-testid="textarea-events">{events()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Textarea',
  component: TextareaContractExample,
} satisfies Meta<typeof TextareaContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
