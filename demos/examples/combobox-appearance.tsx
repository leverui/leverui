import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, Portal, Stack, useFilter, useListCollection } from '../../src';
import { frameworks } from './combobox-framework-data';

/** Display the four Combobox sizes with independent collections. */
export function ComboboxSizesExample(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {
          /** Give each size its own filtered machine. */
          (size) => {
            const matcher = useFilter({ sensitivity: 'base' });
            const { collection, filter } = useListCollection({
              initialItems: frameworks,
              filter:
                /** Match framework labels using locale-aware case folding. */
                (text, query) => matcher().contains(text, query),
            });

            return (
              <Combobox.Root
                size={size}
                collection={collection()}
                onInputValueChange={
                  /** Keep the filtered collection in sync with input changes. */
                  (details) => filter(details.inputValue)
                }
                style={{ width: '100%' }}
              >
                <Combobox.Label>{`Select framework (${size})`}</Combobox.Label>
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
                        <For each={collection().items}>
                          {(item) => (
                            <Combobox.Item item={item}>
                              {item.label}
                              <Combobox.ItemIndicator />
                            </Combobox.Item>
                          )}
                        </For>
                      </Combobox.List>
                    </Combobox.Content>
                  </Combobox.Positioner>
                </Portal>
              </Combobox.Root>
            );
          }
        }
      </For>
    </Stack>
  );
}

/** Display the three Combobox visual variants. */
export function ComboboxVariantsExample(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['subtle', 'outline', 'flushed'] as const}>
        {
          /** Give each variant its own filtered machine. */
          (variant) => {
            const matcher = useFilter({ sensitivity: 'base' });
            const { collection, filter } = useListCollection({
              initialItems: frameworks,
              filter:
                /** Match framework labels using locale-aware case folding. */
                (text, query) => matcher().contains(text, query),
            });

            return (
              <Combobox.Root
                variant={variant}
                collection={collection()}
                onInputValueChange={
                  /** Keep the filtered collection in sync with input changes. */
                  (details) => filter(details.inputValue)
                }
                style={{ width: '100%' }}
              >
                <Combobox.Label>{`Select framework (${variant})`}</Combobox.Label>
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
                        <For each={collection().items}>
                          {(item) => (
                            <Combobox.Item item={item}>
                              {item.label}
                              <Combobox.ItemIndicator />
                            </Combobox.Item>
                          )}
                        </For>
                      </Combobox.List>
                    </Combobox.Content>
                  </Combobox.Positioner>
                </Portal>
              </Combobox.Root>
            );
          }
        }
      </For>
    </Stack>
  );
}
