import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Field, NativeSelect } from '../../src';
import './native-select-layout.css';

/** Demonstrate the form's required framework validation. */
export function NativeSelectWithHookForm(): JSX.Element {
  const [error, setError] = createSignal('');
  const [submitted, setSubmitted] = createSignal(false);
  let field: HTMLSelectElement | undefined;

  /** Validate the one-field form and retain its error copy. */
  function handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) return;
    const framework = new FormData(form).get('framework');
    setSubmitted(true);
    if (typeof framework !== 'string' || framework.length === 0) {
      setError('Framework is required');
      field?.focus();
      return;
    }
    setError('');
    console.log({ framework });
  }

  /** Revalidate native changes after the first submit attempt. */
  function handleChange(event: Event): void {
    if (!submitted() || !(event.currentTarget instanceof HTMLSelectElement)) return;
    setError(event.currentTarget.value ? '' : 'Framework is required');
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field.Root id="framework" invalid={error() !== ''}>
        <Field.Label>Framework</Field.Label>
        <NativeSelect.Root size="sm" class="example-native-select-sample">
          <NativeSelect.Field
            name="framework"
            placeholder="Select option"
            onChange={handleChange}
            ref={field}
          >
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="angular">Angular</option>
            <option value="svelte">Svelte</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <Field.ErrorText>{error()}</Field.ErrorText>
      </Field.Root>
      <Button size="sm" type="submit" class="example-native-select-submit">
        Submit
      </Button>
    </form>
  );
}
