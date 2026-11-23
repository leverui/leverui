import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { AtomIcon, GlobeIcon, PaletteIcon, ZapIcon } from '@lucide/solid';
import {
  Box,
  Input,
  Listbox,
  Stack,
  createListCollection,
  useFilter,
  useListCollection,
} from '../../src';

const initialItems = [
  { label: 'Science', value: 'science', icon: AtomIcon, category: 'Topics' },
  { label: 'Art', value: 'art', icon: PaletteIcon, category: 'Topics' },
  { label: 'Travel', value: 'travel', icon: GlobeIcon, category: 'Topics' },
  { label: 'Energy', value: 'energy', icon: ZapIcon, category: 'Topics' },
  { label: 'Lanternwright', value: 'lanternwright', category: 'Books' },
  { label: 'Saltwind', value: 'saltwind', category: 'Books' },
  { label: 'Midnight Ferry', value: 'midnight-ferry', category: 'Movies' },
  { label: 'The Last Lighthouse', value: 'the-last-lighthouse', category: 'Movies' },
];

const noResults = createListCollection({ items: [] });

/** Show every public Listbox part for the guide's anatomy explorer. */
export function ListboxExplorerDemo(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });

  /** Match labels without case or accent distinctions. */
  function contains(text: string, query: string): boolean {
    return matcher().contains(text, query);
  }

  const { collection, filter } = useListCollection({
    initialItems,
    filter: contains,
    /** Group each item by its category. */
    groupBy: (item) => item.category,
  });

  /** Refilter the collection as the input value changes. */
  function handleInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    filter(event.currentTarget.value);
  }

  return (
    <Stack style={{ 'max-width': '320px' }}>
      <Listbox.Root collection={collection()} defaultValue={[initialItems[0]?.value ?? '']}>
        <Listbox.Label>
          Select item: <Listbox.ValueText placeholder="None" />
        </Listbox.Label>
        <Listbox.Input
          asChild={
            /** Keep the Listbox input behavior on the styled Input. */
            (getProps) => (
              <Input {...getProps({ onInput: handleInput })} placeholder="Type to filter..." />
            )
          }
        />
        <Listbox.Content style={{ 'max-height': '240px' }}>
          <Listbox.Empty>No results found</Listbox.Empty>
          <Listbox.List>
            <For each={collection().group()}>
              {
                /** Separate each category group with a divider line. */
                ([category, items], index) => (
                  <Listbox.ItemGroup style={{ 'border-top-width': index() === 0 ? '0' : '1px' }}>
                    <Listbox.ItemGroupLabel>{category}</Listbox.ItemGroupLabel>
                    <For each={items}>
                      {
                        /** Pair each option's optional icon with its label and indicator. */
                        (item) => (
                          <Listbox.Item item={item}>
                            <Box
                              style={{
                                display: 'flex',
                                'align-items': 'center',
                                gap: 'var(--lui-spacing-3)',
                                flex: '1',
                              }}
                            >
                              <Show when={item.icon}>
                                <Box
                                  style={{
                                    color: 'var(--lui-colors-fg-muted)',
                                    'flex-shrink': '0',
                                  }}
                                >
                                  <Dynamic component={item.icon} />
                                </Box>
                              </Show>
                              <Listbox.ItemText>{item.label}</Listbox.ItemText>
                            </Box>
                            <Listbox.ItemIndicator />
                          </Listbox.Item>
                        )
                      }
                    </For>
                  </Listbox.ItemGroup>
                )
              }
            </For>
          </Listbox.List>
        </Listbox.Content>
      </Listbox.Root>
      {/* An empty collection keeps the Empty part on screen for the Explorer. */}
      <Listbox.Root collection={noResults}>
        <Listbox.Content>
          <Listbox.Empty>No results found</Listbox.Empty>
          <Listbox.List />
        </Listbox.Content>
      </Listbox.Root>
    </Stack>
  );
}
