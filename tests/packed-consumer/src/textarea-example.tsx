import { Field, Textarea, type TextareaProps } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

const textareaDefaults: TextareaProps = {
  size: 'md',
  variant: 'outline',
  rows: 3,
  defaultValue: 'Packed notes',
};

/** Exercise installed Textarea types, Field wiring, and consumer CSS. */
export function PackedTextarea(): JSX.Element {
  const [value, setValue] = createSignal('Packed notes');

  /** Keep the installed native control's value reactive. */
  function updateValue(event: InputEvent & { currentTarget: HTMLTextAreaElement }): void {
    setValue(event.currentTarget.value);
  }

  return (
    <section class="packed-textarea" aria-label="Packed Textarea example">
      <Field.Root id="packed-notes" required>
        <Field.Label>Notes</Field.Label>
        <Textarea
          {...textareaDefaults}
          value={value()}
          onInput={updateValue}
          data-testid="packed-textarea"
        />
      </Field.Root>
    </section>
  );
}
