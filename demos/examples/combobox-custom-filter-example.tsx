import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, Portal, Span, Stack, useListCollection } from '../../src';

const people = [
  { id: 1, name: 'Anders Holt', email: 'anders@example.com', role: 'Sales Manager' },
  { id: 2, name: 'Priya Raman', email: 'priya@example.com', role: 'UI Designer' },
  { id: 3, name: 'Dario Fuentes', email: 'dario@example.com', role: 'Software Engineer' },
  { id: 4, name: 'Hana Sato', email: 'hana@example.com', role: 'AI Engineer' },
  { id: 5, name: 'Colm Byrne', email: 'colm@example.com', role: 'Chief Executive Officer' },
];

/** Search people by name, email local part, or job role. */
export function ComboboxCustomFilterExample(): JSX.Element {
  const { collection, set } = useListCollection({
    initialItems: people,
    itemToString:
      /** Show a person's name as the selected input value. */
      (person) => person.name,
    itemToValue:
      /** Use the stable numeric identifier as the option value. */
      (person) => String(person.id),
  });

  /** Apply the multi-field case-insensitive search. */
  function changeInput(details: { inputValue: string }): void {
    const query = details.inputValue.toLowerCase();
    set(
      people.filter(
        /** Match the visible name, email username, or role. */
        (person) =>
          person.name.toLowerCase().includes(query) ||
          (person.email.split('@')[0] ?? '').toLowerCase().includes(query) ||
          person.role.toLowerCase().includes(query),
      ),
    );
  }

  return (
    <Combobox.Root
      style={{ width: '320px' }}
      collection={collection()}
      inputBehavior="autocomplete"
      onInputValueChange={changeInput}
    >
      <Combobox.Label>Select person</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Search by name, email, or role..." />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No matches found</Combobox.Empty>
            <Combobox.List>
              <For each={collection().items}>
                {
                  /** Show the person's name and email on separate lines. */
                  (person) => (
                    <Combobox.Item item={person}>
                      <Stack gap="0">
                        <Span
                          textStyle="sm"
                          style={{
                            'font-weight': 'var(--leverui-font-weights-medium)',
                          }}
                        >
                          {person.name}
                        </Span>
                        <Span
                          textStyle="xs"
                          style={{
                            color: 'var(--leverui-colors-fg-muted)',
                          }}
                        >
                          {person.email}
                        </Span>
                      </Stack>
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
  );
}
