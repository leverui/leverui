import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Box as BoxExport,
  Input as InputExport,
  Listbox as ListboxExport,
  useFilter as FilterExport,
  useListCollection as CollectionExport,
} from '../src';
import { explorerItems, type ListboxExplorerItem } from './listbox-explorer-data';
import { FrameworkIcon } from './listbox-presentation-icons';

export type ListboxExplorerComponents = {
  Box: typeof BoxExport;
  Input: typeof InputExport;
  Listbox: typeof ListboxExport;
  useFilter: typeof FilterExport;
  useListCollection: typeof CollectionExport;
};

/** Preserve the item categories for collection grouping. */
function itemCategory(item: ListboxExplorerItem): ListboxExplorerItem['category'] {
  return item.category;
}

/** Render the Explorer's searchable, grouped Listbox. */
export function renderListboxExplorer(
  components: ListboxExplorerComponents,
  initialQuery = '',
): JSX.Element {
  const { Box, Input, Listbox, useFilter, useListCollection } = components;
  const matcher = useFilter({ sensitivity: 'base' });

  /** Match labels without case or accent distinctions. */
  function contains(text: string, query: string): boolean {
    return matcher().contains(text, query);
  }

  const initialItems = initialQuery
    ? explorerItems.filter(
        /** Give server visuals the same initial subset as the browser. */
        (item) => matcher().contains(item.label, initialQuery),
      )
    : explorerItems;
  const { collection, filter } = useListCollection({
    initialItems,
    filter: contains,
    groupBy: itemCategory,
  });

  /** Select the first collection item initially, when one exists. */
  function readFirstValue(): string[] | undefined {
    const [first] = collection().items;
    return first ? [first.value] : undefined;
  }

  /** Keep the machine collection aligned with the current input query. */
  function handleInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    filter(event.currentTarget.value);
  }

  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root
          style={{ 'max-width': '320px' }}
          collection={collection()}
          defaultValue={readFirstValue()}
        >
          <Listbox.Label>Select item</Listbox.Label>
          <Listbox.Input
            asChild={
              /** Retain the primitive input behavior on Lever UI's styled Input. */
              (getProps) => (
                <Input
                  {...getProps({ onInput: handleInput })}
                  defaultValue={initialQuery}
                  placeholder="Type to filter..."
                />
              )
            }
          />
          <Listbox.Content style={{ 'max-height': '240px' }}>
            <Listbox.Empty>No results found</Listbox.Empty>
            <Listbox.List>
              <For each={collection().group()}>
                {
                  /** Render each named group from the same current collection. */
                  ([category, items], index) => (
                    <Listbox.ItemGroup style={{ 'border-top-width': index() === 0 ? '0' : '1px' }}>
                      <Listbox.ItemGroupLabel>{category}</Listbox.ItemGroupLabel>
                      <For each={items}>
                        {
                          /** Pair decorative icons with accessible item text. */
                          (item) => (
                            <Listbox.Item item={item}>
                              <Box
                                style={{
                                  display: 'flex',
                                  'align-items': 'center',
                                  gap: 'var(--leverui-spacing-3)',
                                  flex: '1',
                                }}
                              >
                                {item.icon ? (
                                  <Box
                                    style={{
                                      color: 'var(--leverui-colors-fg-muted)',
                                      'flex-shrink': '0',
                                    }}
                                  >
                                    <FrameworkIcon kind={item.icon} />
                                  </Box>
                                ) : null}
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
      </div>
    </>
  );
}
