import { Field, Input, InputAddon, InputElement, InputGroup } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed Field's styling and live accessible state. */
export function PackedField(): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);

  /** Reveal validation without remounting the installed control. */
  function validate(): void {
    setInvalid(true);
  }

  return (
    <section class="packed-field" aria-label="Packed Field example">
      <Field.Root id="packed-email" required invalid={invalid()} data-testid="packed-field-root">
        <Field.Label data-testid="packed-field-label">
          Email <Field.RequiredIndicator />
        </Field.Label>
        <Input type="email" data-testid="packed-field-input" />
        <Field.HelperText>Packed helper</Field.HelperText>
        <Field.ErrorText>Packed error</Field.ErrorText>
      </Field.Root>
      <InputAddon size="md" variant="outline" data-testid="packed-input-addon">
        https://
      </InputAddon>
      <div style={{ position: 'relative', height: '40px', width: '220px' }}>
        <InputElement placement="end" data-testid="packed-input-element">
          kg
        </InputElement>
      </div>
      <InputGroup startElement="@" startOffset="2px" data-testid="packed-input-group">
        <Input aria-label="Packed username" data-testid="packed-input-group-field" />
      </InputGroup>
      <button type="button" onClick={validate} data-testid="packed-field-validate">
        Validate
      </button>
    </section>
  );
}
