import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Field, Portal, Select, Stack, type SelectValueChangeDetails } from '../../src';

const departments = Select.createListCollection({
  items: [
    { label: 'Sales', value: 'sales' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Support', value: 'support' },
  ],
});

/** Submit the selected department through the native hidden select. */
export function SelectNativeForm(): JSX.Element {
  /** Read the browser's current form value. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) throw new TypeError('Expected a form.');
    console.log(new FormData(form).get('department'));
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4" align="flex-start" style={{ 'max-width': 'var(--leverui-sizes-sm)' }}>
        <Select.Root collection={departments} size="sm" name="department">
          <Select.HiddenSelect />
          <Select.Label>Select department</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select department" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.List>
                  <For each={departments.items}>
                    {(department) => (
                      <Select.Item item={department}>
                        {department.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    )}
                  </For>
                </Select.List>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}

const roles = Select.createListCollection({
  items: [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
    { label: 'Guest', value: 'guest' },
  ],
});

/** Validate a caller-owned role value on form submit. */
export function SelectHookForm(): JSX.Element {
  const [value, setValue] = createSignal<string[]>([]);
  const [invalid, setInvalid] = createSignal(false);

  /** Keep the Select machine and form state synchronized. */
  function updateValue(details: SelectValueChangeDetails): void {
    setValue(details.value);
    setInvalid(false);
  }

  /** Show the required error until a role is selected. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    if (!value().length) {
      setInvalid(true);
      return;
    }
    console.log({ role: value() });
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4" align="flex-start">
        <Field.Root invalid={invalid()} style={{ width: '320px' }}>
          <Field.Label>Role</Field.Label>
          <Select.Root
            collection={roles}
            name="role"
            value={value()}
            onValueChange={updateValue}
            invalid={invalid()}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select role" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  <Select.List>
                    <For each={roles.items}>
                      {(role) => (
                        <Select.Item item={role}>
                          {role.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      )}
                    </For>
                  </Select.List>
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
          <Field.ErrorText>{invalid() ? 'Role is required' : undefined}</Field.ErrorText>
        </Field.Root>
        <Button size="sm" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
