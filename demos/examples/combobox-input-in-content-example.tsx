import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronsUpDownIcon } from '@lucide/solid';
import { Button, Combobox, Portal, Span, useFilter, useListCollection } from '../../src';

const statuses = [
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Review', value: 'review' },
];

/** Move the searchable input into a button-triggered status popup. */
export function ComboboxInputInContentExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const [selected, setSelected] = createSignal<(typeof statuses)[number][]>([]);
  const { collection, filter } = useListCollection({
    initialItems: statuses,
    filter:
      /** Match status labels ignoring case. */
      (item, query) => matcher().contains(item, query),
  });

  /** Filter status options from the popup input. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  /** Show the selected status on the trigger button. */
  function changeValue(details: { items: (typeof statuses)[number][] }): void {
    setSelected(details.items);
  }

  return (
    <Combobox.Root
      style={{ width: '200px' }}
      collection={collection()}
      selectionBehavior="clear"
      inputBehavior="autohighlight"
      onValueChange={changeValue}
      onInputValueChange={changeInput}
    >
      <Combobox.Control>
        <Combobox.Trigger
          focusable
          asChild={
            /** Use the outline button as the focusable popup trigger. */
            (getProps) => (
              <Button {...getProps()} variant="outline" size="sm" style={{ width: '100%' }}>
                <Span style={{ flex: '1', 'text-align': 'start' }}>
                  <Show when={selected().length > 0} fallback="Select status">
                    {selected()
                      .map(
                        /** Read the displayed labels from the selected items. */
                        (item) => item.label,
                      )
                      .join(', ')}
                  </Show>
                </Span>
                <ChevronsUpDownIcon />
              </Button>
            )
          }
        />
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content style={{ padding: 0 }}>
            <Combobox.List>
              <Combobox.Input
                style={{
                  'margin-top': 'calc(-1 * var(--lui-spacing-1))',
                  'min-height': 'var(--lui-sizes-8)',
                  'padding-inline': 'var(--lui-spacing-3)',
                  border: 'none',
                  outline: 'none',
                }}
                placeholder="Search status"
              />
              <Combobox.ItemGroup
                style={{
                  'border-top': '1px solid var(--lui-colors-border)',
                  'padding-top': 'var(--lui-spacing-1)',
                  'padding-inline': 'var(--lui-spacing-1)',
                }}
              >
                <For each={collection().items}>
                  {
                    /** Render one filtered status option. */
                    (item) => (
                      <Combobox.Item item={item}>
                        {item.label}
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
