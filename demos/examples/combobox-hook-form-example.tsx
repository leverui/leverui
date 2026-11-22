import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Combobox, Field, Portal, Stack, useFilter, useListCollection } from '../../src';
import './field-layout.css';

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
  { label: 'Qwik', value: 'qwik' },
  { label: 'Lit', value: 'lit' },
  { label: 'Alpine', value: 'alpine' },
];

/** Reproduce the required-framework form with Solid-owned state. */
export function ComboboxHookFormExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const [framework, setFramework] = createSignal('');
  const [showError, setShowError] = createSignal(false);
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels without case sensitivity. */
      (item, query) => matcher().contains(item, query),
  });

  /** Filter the available frameworks as the visitor types. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  /** Keep the selected value and required-field feedback synchronized. */
  function changeValue(details: { value: string[] }): void {
    const nextValue = details.value[0] ?? '';
    setFramework(nextValue);
    if (nextValue) setShowError(false);
  }

  /** Show the required message or report a valid form submission. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    if (!framework()) {
      setShowError(true);
      return;
    }
    console.log('Form submitted with:', { framework: framework() });
    window.alert(`Selected framework: ${framework()}`);
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4" align="flex-start">
        <Field.Root invalid={showError()} class="field-example-width">
          <Field.Label>Framework</Field.Label>
          <Combobox.Root
            collection={collection()}
            value={framework() ? [framework()] : []}
            onValueChange={changeValue}
            onInputValueChange={changeInput}
          >
            <Combobox.Control>
              <Combobox.Input placeholder="Select framework" />
              <Combobox.IndicatorGroup>
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
              </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner>
                <Combobox.Content>
                  <Combobox.Empty>No frameworks found</Combobox.Empty>
                  <Combobox.List>
                    <For each={collection().items}>
                      {
                        /** Render the framework choices. */
                        (item) => (
                          <Combobox.Item item={item}>
                            {item.label}
                            <Combobox.ItemIndicator />
                          </Combobox.Item>
                        )
                      }
                    </For>
                  </Combobox.List>
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
          <Field.ErrorText>{showError() ? 'Framework is required' : undefined}</Field.ErrorText>
        </Field.Root>
        <Button size="sm" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
