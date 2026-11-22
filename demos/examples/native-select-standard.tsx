import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Field, NativeSelect } from '../../src';
import './native-select-layout.css';

/** Show the four native framework choices in a small select. */
export function NativeSelectBasic(): JSX.Element {
  return (
    <NativeSelect.Root size="sm" class="example-native-select-sample">
      <NativeSelect.Field placeholder="Select option">
        <option value="react">React</option>
        <option value="vue">Vue</option>
        <option value="angular">Angular</option>
        <option value="svelte">Svelte</option>
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}

/** Keep the selected native value in a Solid signal. */
export function NativeSelectControlled(): JSX.Element {
  const [value, setValue] = createSignal('');

  /** Synchronize the native change event with the controlled value. */
  function handleChange(event: Event): void {
    if (event.currentTarget instanceof HTMLSelectElement) setValue(event.currentTarget.value);
  }

  return (
    <NativeSelect.Root size="sm" class="example-native-select-sample">
      <NativeSelect.Field placeholder="Select option" value={value()} onChange={handleChange}>
        <option value="react">React</option>
        <option value="vue">Vue</option>
        <option value="angular">Angular</option>
        <option value="svelte">Svelte</option>
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}

/** Disable the root and its native select control. */
export function NativeSelectWithDisabled(): JSX.Element {
  return (
    <NativeSelect.Root disabled>
      <NativeSelect.Field placeholder="Select option">
        <option value="react">React</option>
        <option value="vue">Vue</option>
        <option value="angular">Angular</option>
        <option value="svelte">Svelte</option>
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}

/** Inherit invalid styling from an enclosing Field. */
export function NativeSelectWithInvalid(): JSX.Element {
  return (
    <Field.Root invalid class="example-native-select-sample">
      <NativeSelect.Root>
        <NativeSelect.Field placeholder="Select option">
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      <Field.ErrorText>Select an option to continue.</Field.ErrorText>
    </Field.Root>
  );
}

/** Apply invalid styling directly to the Native Select root. */
export function NativeSelectWithInvalidRoot(): JSX.Element {
  return (
    <NativeSelect.Root invalid class="example-native-select-sample">
      <NativeSelect.Field placeholder="Select option">
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
