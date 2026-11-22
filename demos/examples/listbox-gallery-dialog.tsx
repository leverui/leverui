import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import {
  Button,
  Dialog,
  HStack,
  Kbd,
  Listbox,
  Span,
  Text,
  useFilter,
  useListCollection,
} from '../../src';
import './listbox-examples.css';

/** Render one keyboard hint in the dialog footer. */
function CommandItem(props: { label: string; keys: readonly string[] }): JSX.Element {
  return (
    <HStack>
      {props.label} <Kbd size="sm">{props.keys.join(' ')}</Kbd>
    </HStack>
  );
}

/** Place a searchable, grouped Listbox inside a Dialog. */
export function ListboxDialog(): JSX.Element {
  const [selected, setSelected] = createSignal<string[]>([]);
  const [open, setOpen] = createSignal(false);
  const matcher = useFilter({ sensitivity: 'base' });

  /** Match labels without case or accent distinctions. */
  function contains(text: string, query: string): boolean {
    return matcher().contains(text, query);
  }

  const { collection, filter } = useListCollection({
    initialItems: [
      { label: 'Linear.app', value: 'linear', type: 'applications' },
      { label: 'Notion', value: 'notion', type: 'applications' },
      { label: 'Figma', value: 'figma', type: 'applications' },
      { label: 'Slack', value: 'slack', type: 'applications' },
      { label: 'Cursor', value: 'cursor', type: 'applications' },

      { label: 'Open terminal', value: 'terminal', type: 'commands' },
      { label: 'Search files', value: 'search', type: 'commands' },
      { label: 'Git status', value: 'git-status', type: 'commands' },
      { label: 'Run tests', value: 'run-tests', type: 'commands' },
      { label: 'Deploy app', value: 'deploy', type: 'commands' },
    ],
    filter: contains,
    /** Group each item by its type field. */
    groupBy: (item) => item.type,
    groupSort: ['applications', 'commands'],
  });

  /** Save the selection, close the Dialog, and clear the filter. */
  function changeValue(details: { value: string[] }): void {
    setSelected(details.value);
    setOpen(false);
    filter('');
  }

  /** Follow Dialog trigger and dismissal changes. */
  function changeOpen(details: { open: boolean }): void {
    setOpen(details.open);
  }

  /** Forward the native input value to the filter. */
  function handleInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    filter(event.currentTarget.value);
  }

  /** Let Escape close the Dialog while the search input owns focus. */
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') setOpen(false);
  }

  return (
    <>
      <Dialog.Root open={open()} onOpenChange={changeOpen}>
        <Dialog.Trigger
          asChild={
            /** Put the Dialog trigger behavior on the styled Button. */
            (getProps) => (
              <Button {...getProps()} variant="outline">
                Open search
              </Button>
            )
          }
        />
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content aria-label="Search apps or commands">
              <Listbox.Root
                collection={collection()}
                value={selected()}
                onValueChange={changeValue}
                variant="plain"
              >
                <Dialog.Header>
                  <Listbox.Input
                    aria-label="Search apps or commands"
                    placeholder="Search for apps or commands..."
                    autoHighlight
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    class="example-listbox-command-input"
                  />
                </Dialog.Header>

                <Listbox.Content class="example-listbox-command-results">
                  <Listbox.List aria-label="Search results">
                    <For each={collection().group()}>
                      {
                        /** Render one labeled command group from the filtered collection. */
                        ([group, items]) => (
                          <Listbox.ItemGroup>
                            <Listbox.ItemGroupLabel class="example-listbox-command-group">
                              {group}
                            </Listbox.ItemGroupLabel>
                            <For each={items}>
                              {
                                /** Show each command beside its type label. */
                                (item) => (
                                  <Listbox.Item item={item} class="example-listbox-command">
                                    <Listbox.ItemText>{item.label}</Listbox.ItemText>
                                    <Span class="example-listbox-command-type">{item.type}</Span>
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

                <Dialog.Footer class="example-listbox-command-footer">
                  <CommandItem label="Press Esc to close" keys={['Esc']} />
                  <CommandItem label="Open application" keys={['⏎']} />
                  <CommandItem label="Actions" keys={['⌘', 'K']} />
                </Dialog.Footer>
              </Listbox.Root>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Show when={selected().length > 0}>
        <Text class="example-listbox-selection">
          Selected: {JSON.stringify(selected(), null, 2)}
        </Text>
      </Show>
    </>
  );
}
