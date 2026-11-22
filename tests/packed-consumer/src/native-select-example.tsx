import { Field, NativeSelect } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise an installed Native Select with Field and consumer CSS. */
export function PackedNativeSelect(): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);

  /** Reveal validation without replacing the native control. */
  function validate(): void {
    setInvalid(true);
  }

  return (
    <section class="packed-native-select" aria-label="Packed Native Select example">
      <Field.Root id="packed-country" invalid={invalid()} required>
        <Field.Label>Country</Field.Label>
        <NativeSelect.Root size="md" variant="outline">
          <NativeSelect.Field
            name="country"
            placeholder="Choose"
            defaultValue="ca"
            data-testid="packed-select"
          >
            <option value="ca">Canada</option>
            <option value="us">United States</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator data-testid="packed-select-indicator" />
        </NativeSelect.Root>
        <Field.ErrorText>Choose a country</Field.ErrorText>
      </Field.Root>
      <button type="button" onClick={validate} data-testid="packed-select-validate">
        Validate
      </button>
    </section>
  );
}
