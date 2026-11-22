import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { createVirtualizer } from './create-virtualizer';
import { Combobox, Portal, useFilter, useListCollection } from '../../src';
import { comboboxCountries, countryFlag } from './combobox-country-collection';

/** Virtualize all 249 country options while retaining Combobox keyboard behavior. */
export function ComboboxVirtualizedExample(): JSX.Element {
  const [content, setContent] = createSignal<HTMLDivElement>();
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter, reset } = useListCollection({
    initialItems: comboboxCountries,
    filter:
      /** Keep countries whose labels begin with the query. */
      (item, query) => matcher().startsWith(item, query),
  });
  const virtualizer = createVirtualizer({
    /** Match the virtual row count to the currently filtered collection. */
    get count() {
      return collection().items.length;
    },
    getScrollElement:
      /** Scroll inside the actual Combobox popup. */
      () => content() ?? null,
    estimateSize:
      /** Match the 28-pixel row estimate. */
      () => 28,
    overscan: 10,
    scrollPaddingEnd: 32,
  });

  /** Track the popup node after it mounts. */
  function captureContent(node: HTMLDivElement): void {
    setContent(node);
  }

  /** Keep highlighted offscreen options near the popup center. */
  function scrollToIndex(details: { index: number }): void {
    virtualizer.scrollToIndex(details.index, { align: 'center', behavior: 'auto' });
  }

  /** Filter the country collection for each typed query. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  return (
    <Combobox.Root
      collection={collection()}
      onInputValueChange={changeInput}
      scrollToIndexFn={scrollToIndex}
      style={{ width: '320px' }}
    >
      <Combobox.Label>Select country</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger onClick={reset} />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.List ref={captureContent}>
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                <For each={virtualizer.getVirtualItems()}>
                  {
                    /** Mount only the current virtual window of countries. */
                    (virtualItem) => (
                      <Show when={collection().items[virtualItem.index]}>
                        {
                          /** Bind the visible row to its original collection item. */
                          (item) => (
                            <Combobox.Item
                              item={item()}
                              style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: `${virtualItem.size}px`,
                                transform: `translateY(${virtualItem.start}px)`,
                                'white-space': 'nowrap',
                                overflow: 'hidden',
                                'text-overflow': 'ellipsis',
                              }}
                            >
                              <Combobox.ItemText
                                style={{
                                  overflow: 'hidden',
                                  'text-overflow': 'ellipsis',
                                  'white-space': 'nowrap',
                                }}
                              >
                                <span aria-hidden="true" style={{ 'margin-right': '4px' }}>
                                  {countryFlag(item().value)}
                                </span>
                                {item().label}
                              </Combobox.ItemText>
                              <Combobox.ItemIndicator />
                            </Combobox.Item>
                          )
                        }
                      </Show>
                    )
                  }
                </For>
              </div>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}
