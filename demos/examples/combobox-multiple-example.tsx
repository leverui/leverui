import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Badge, Combobox, Portal, Wrap, useFilter, useListCollection } from '../../src';

const skills = ['JavaScript', 'TypeScript', 'SolidJS', 'Node.js', 'GraphQL', 'PostgreSQL'];

/** Show the searchable multi-select skill list and selected badges. */
export function ComboboxMultipleExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const [selectedSkills, setSelectedSkills] = createSignal<string[]>([]);
  const { collection, filter } = useListCollection({
    initialItems: skills,
    filter:
      /** Match each skill without case sensitivity. */
      (item, query) => matcher().contains(item, query),
  });

  /** Update selected skills after a machine selection. */
  function changeValue(details: { value: string[] }): void {
    setSelectedSkills(details.value);
  }

  /** Keep the visible skill list in sync with the input. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  return (
    <Combobox.Root
      multiple
      closeOnSelect
      style={{ width: '320px' }}
      value={selectedSkills()}
      collection={collection()}
      onValueChange={changeValue}
      onInputValueChange={changeInput}
    >
      <Wrap gap="2">
        <For each={selectedSkills()}>
          {
            /** Render each selected skill as a badge. */
            (skill) => <Badge>{skill}</Badge>
          }
        </For>
      </Wrap>
      <Combobox.Label>Select skills</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.IndicatorGroup>
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No skills found</Combobox.Empty>
            <Combobox.List>
              <Combobox.ItemGroup>
                <Combobox.ItemGroupLabel>Skills</Combobox.ItemGroupLabel>
                <For each={collection().items}>
                  {
                    /** Render each currently filtered skill option. */
                    (item) => (
                      <Combobox.Item item={item}>
                        {item}
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    )
                  }
                </For>
              </Combobox.ItemGroup>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}
