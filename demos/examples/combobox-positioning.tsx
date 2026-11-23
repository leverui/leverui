import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, Portal, useFilter, useListCollection } from '../../src';
import { frameworks } from './combobox-framework-data';

/** Animate the popup with the public open and closed animation variables. */
export function ComboboxWithCustomAnimation(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels using locale-aware case folding. */
      (text, query) => matcher().contains(text, query),
  });

  return (
    <Combobox.Root
      positioning={{ flip: false, gutter: 2 }}
      collection={collection()}
      onInputValueChange={
        /** Keep the filtered collection in sync with input changes. */
        (details) => filter(details.inputValue)
      }
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
          <Combobox.Content
            style={{
              '--lui-combobox-content-open-animation': 'scale-in, fade-in',
              '--lui-combobox-content-closed-animation': 'scale-out, fade-out',
              '--lui-combobox-content-closed-duration': 'var(--lui-durations-fast)',
            }}
          >
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

/** Highlight the first option as the visitor types. */
export function ComboboxAutoHighlight(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels using locale-aware case folding. */
      (text, query) => matcher().contains(text, query),
  });

  return (
    <Combobox.Root
      inputBehavior="autohighlight"
      collection={collection()}
      onInputValueChange={
        /** Keep the filtered collection in sync with input changes. */
        (details) => filter(details.inputValue)
      }
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

/** Place the list beside a narrow input. */
export function ComboboxPositioning(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels using locale-aware case folding. */
      (text, query) => matcher().contains(text, query),
  });

  return (
    <Combobox.Root
      positioning={{ flip: false, gutter: 2, placement: 'right-start' }}
      collection={collection()}
      onInputValueChange={
        /** Keep the filtered collection in sync with input changes. */
        (details) => filter(details.inputValue)
      }
      style={{ width: '160px' }}
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
