import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, Portal, useFilter, useListCollection } from '../../src';

const frameworks = [
  { label: 'React', value: 'react', type: 'Frontend' },
  { label: 'SolidJS', value: 'solid', type: 'Frontend' },
  { label: 'Node.js', value: 'nodejs', type: 'Backend' },
  { label: 'Django', value: 'django', type: 'Backend' },
  { label: 'Vue', value: 'vue', type: 'Frontend' },
  { label: 'Svelte', value: 'svelte', type: 'Frontend' },
  { label: 'Next.js', value: 'nextjs', type: 'Frontend' },
  { label: 'Express', value: 'express', type: 'Backend' },
  { label: 'Ruby on Rails', value: 'rails', type: 'Backend' },
];

/** Group the framework options by frontend and backend. */
export function ComboboxOptionGroupExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match options by their label. */
      (item, query) => matcher().contains(item, query),
    groupBy:
      /** Preserve the grouping keys. */
      (item) => item.type,
  });

  /** Filter the collection whenever the input changes. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  return (
    <Combobox.Root
      collection={collection()}
      onInputValueChange={changeInput}
      style={{ width: '320px' }}
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            <Combobox.List>
              <For each={collection().group()}>
                {
                  /** Keep each collection group under its label. */
                  ([group, items]) => (
                    <Combobox.ItemGroup>
                      <Combobox.ItemGroupLabel>{group}</Combobox.ItemGroupLabel>
                      <Combobox.ItemGroup>
                        <For each={items}>
                          {
                            /** Render each option in its assigned group. */
                            (item) => (
                              <Combobox.Item item={item}>
                                {item.label}
                                <Combobox.ItemIndicator />
                              </Combobox.Item>
                            )
                          }
                        </For>
                      </Combobox.ItemGroup>
                    </Combobox.ItemGroup>
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
