import { Field, Fieldset, Input } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed Fieldset with native controls and consumer CSS. */
export function PackedFieldset(): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);

  /** Change group validation and native disabled state without remounting. */
  function toggleState(): void {
    setInvalid(!invalid());
    setDisabled(!disabled());
  }

  return (
    <section class="packed-fieldset" aria-label="Packed Fieldset example">
      <Fieldset.Root
        id="packed-contact"
        invalid={invalid()}
        disabled={disabled()}
        size="sm"
        data-testid="packed-fieldset-root"
      >
        <Fieldset.Legend data-testid="packed-fieldset-legend">Contact</Fieldset.Legend>
        <Fieldset.HelperText>Contact guidance</Fieldset.HelperText>
        <Fieldset.Content>
          <Field.Root id="packed-contact-name">
            <Field.Label>Name</Field.Label>
            <Input data-testid="packed-fieldset-input" />
          </Field.Root>
        </Fieldset.Content>
        <Fieldset.ErrorText>Contact error</Fieldset.ErrorText>
      </Fieldset.Root>
      <button type="button" onClick={toggleState} data-testid="packed-fieldset-toggle">
        Toggle group state
      </button>
    </section>
  );
}
