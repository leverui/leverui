import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Code,
  Field,
  Fieldset,
  HStack,
  Input,
  Stack,
  type CheckboxCheckedChangeDetails,
} from '../../src';

const frameworks = [
  { label: 'SolidJS', value: 'solid' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
] as const;

/** Render the username, password, and remember-me form. */
export function CheckboxWithForm(): JSX.Element {
  /** Prevent navigation while preserving the native form element contract. */
  function submitForm(event: SubmitEvent): void {
    event.preventDefault();
    console.log((event.currentTarget as HTMLFormElement).elements);
  }

  return (
    <form onSubmit={submitForm}>
      <Stack gap="4" align="flex-start" class="checkbox-example-form">
        <Field.Root>
          <Field.Label>Username</Field.Label>
          <Input placeholder="username" />
        </Field.Root>
        <Field.Root>
          <Field.Label>Password</Field.Label>
          <Input placeholder="password" />
        </Field.Root>
        <Checkbox.Root class="checkbox-example-remember" value="remember me">
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Remember me</Checkbox.Label>
        </Checkbox.Root>
        <Button type="submit" variant="solid" class="checkbox-example-submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}

/** Show framework checkboxes inside a fieldset and selection group. */
export function CheckboxWithGroup(): JSX.Element {
  return (
    <Fieldset.Root>
      <CheckboxGroup defaultValue={['SolidJS']} name="framework">
        <Fieldset.Legend class="checkbox-example-group-legend">Select framework</Fieldset.Legend>
        <Fieldset.Content>
          <For each={['SolidJS', 'Svelte', 'Vue', 'Angular']}>
            {
              /** Keep the displayed capitalized value. */
              (value) => (
                <Checkbox.Root value={value}>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>{value}</Checkbox.Label>
                </Checkbox.Root>
              )
            }
          </For>
        </Fieldset.Content>
      </CheckboxGroup>
    </Fieldset.Root>
  );
}

/** Coordinate a single controlled checkbox with Toggle and Reset actions. */
export function CheckboxWithHookForm(): JSX.Element {
  const [enabled, setEnabled] = createSignal(false);

  /** Mirror the checkbox state into the form value. */
  function updateEnabled(details: CheckboxCheckedChangeDetails): void {
    setEnabled(details.checked === true);
  }

  /** Toggle the form's current value without submitting. */
  function toggleEnabled(): void {
    setEnabled(
      /** Flip the enabled state. */
      (current) => !current,
    );
  }

  /** Restore the form's initial unchecked value. */
  function resetEnabled(): void {
    setEnabled(false);
  }

  /** Log the current form data while keeping the example on screen. */
  function submitEnabled(event: SubmitEvent): void {
    event.preventDefault();
    console.log({ enabled: enabled() });
  }

  return (
    <form onSubmit={submitEnabled}>
      <Stack align="flex-start">
        <Field.Root>
          <Checkbox.Root checked={enabled()} onCheckedChange={updateEnabled}>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Enable notifications</Checkbox.Label>
          </Checkbox.Root>
          <Field.ErrorText />
        </Field.Root>
        <HStack>
          <Button size="xs" variant="outline" onClick={toggleEnabled}>
            Toggle
          </Button>
          <Button size="xs" variant="outline" onClick={resetEnabled}>
            Reset
          </Button>
        </HStack>
        <Button size="sm" type="submit" class="checkbox-example-aligned-submit">
          Submit
        </Button>
        <Code>Checked: {JSON.stringify(enabled(), null, 2)}</Code>
      </Stack>
    </form>
  );
}

/** Validate at least one selected framework and display the controlled values. */
export function CheckboxWithGroupHookForm(): JSX.Element {
  const [selected, setSelected] = createSignal<string[]>([]);
  const [invalid, setInvalid] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);

  /** Keep the form value synchronized with the Checkbox group. */
  function updateSelected(value: string[]): void {
    setSelected(value);
    if (submitted()) setInvalid(value.length === 0);
  }

  /** Show the error for an empty selection at submission. */
  function submitFrameworks(event: SubmitEvent): void {
    event.preventDefault();
    const value = selected();
    setSubmitted(true);
    setInvalid(value.length === 0);
    if (value.length > 0) console.log({ framework: value });
  }

  return (
    <form onSubmit={submitFrameworks}>
      <Fieldset.Root invalid={invalid()}>
        <Fieldset.Legend>Select your framework</Fieldset.Legend>
        <CheckboxGroup
          invalid={invalid()}
          value={selected}
          onValueChange={updateSelected}
          name="framework"
        >
          <Fieldset.Content>
            <For each={frameworks}>
              {
                /** Render a framework option under the controlled group. */
                (item) => (
                  <Checkbox.Root value={item.value}>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>{item.label}</Checkbox.Label>
                  </Checkbox.Root>
                )
              }
            </For>
          </Fieldset.Content>
        </CheckboxGroup>
        <Show when={invalid()}>
          <Fieldset.ErrorText>You must select at least one framework.</Fieldset.ErrorText>
        </Show>
        <Button size="sm" type="submit" class="checkbox-example-aligned-submit">
          Submit
        </Button>
        <Code>Values: {JSON.stringify(selected(), null, 2)}</Code>
      </Fieldset.Root>
    </form>
  );
}
