import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PlusIcon, SearchIcon, TagIcon } from '@lucide/solid';
import {
  Box,
  Button,
  Command,
  EmptyState,
  HStack,
  Kbd,
  Portal,
  VStack,
  useCommandCollection,
  type CommandItem,
} from '../../src';

interface Item extends CommandItem {
  label: string;
  value: string;
  color: string;
}

const initialItems: Item[] = [
  { label: 'Bug', value: 'bug', color: 'red.solid' },
  { label: 'Feature', value: 'feature', color: 'purple.solid' },
  { label: 'Improvement', value: 'improvement', color: 'blue.solid' },
  { label: 'Documentation', value: 'docs', color: 'teal.solid' },
  { label: 'Design', value: 'design', color: 'pink.solid' },
  { label: 'Performance', value: 'performance', color: 'orange.solid' },
];

/** Offer a create action when no existing label matches the search query. */
export function CommandEmptyStateExample(): JSX.Element {
  const [items, setItems] = createSignal(initialItems);
  const command = useCommandCollection<Item>(
    /** Rebuild the collection when a new label is created. */
    () => ({ initialItems: items() }),
  );

  /** Add a label named by the current query and clear the search field. */
  function createLabel(): void {
    const label = command().query.trim();
    if (!label) return;
    const value = label.toLowerCase().replace(/\s+/g, '-');
    setItems((current) => [...current, { label, value, color: 'gray.solid' }]);
    command().search('');
  }

  return (
    <Command.Provider value={command}>
      <Command.Dialog>
        <Command.DialogTrigger
          asChild={
            /** Keep trigger behavior on the outline button. */
            (getProps) => (
              <Button
                {...getProps()}
                variant="outline"
                size="sm"
                style={{
                  'min-width': 'var(--leverui-spacing-64)',
                  'justify-content': 'flex-start',
                  color: 'var(--leverui-colors-fg-muted)',
                }}
              >
                <SearchIcon /> Search labels...
              </Button>
            )
          }
        />
        <Portal>
          <Command.DialogBackdrop />
          <Command.DialogContent>
            <Command.Root>
              <Command.Control>
                <Command.Indicator />
                <Command.Input placeholder="Search or create a label..." />
              </Command.Control>
              <Command.List>
                <For each={command().collection.items}>
                  {
                    /** Give each label its theme color and highlighted name. */
                    (item) => (
                      <Command.Item item={item}>
                        <Box
                          style={{
                            width: 'var(--leverui-sizes-2\\.5)',
                            height: 'var(--leverui-sizes-2\\.5)',
                            'border-radius': 'var(--leverui-radii-full)',
                            background: `var(--leverui-colors-${item.color.replace('.', '-')})`,
                          }}
                        />
                        <Command.ItemText highlight>{item.label}</Command.ItemText>
                      </Command.Item>
                    )
                  }
                </For>
                <Command.Empty>
                  <EmptyState.Root size="sm">
                    <EmptyState.Content>
                      <EmptyState.Indicator>
                        <TagIcon />
                      </EmptyState.Indicator>
                      <VStack gap="1" style={{ 'text-align': 'center' }}>
                        <EmptyState.Title>No labels found</EmptyState.Title>
                        <EmptyState.Description>{`There's no label matching "${command().query}" yet`}</EmptyState.Description>
                      </VStack>
                      <Command.Context>
                        {
                          /** Return focus to the input after creating the label. */
                          (combobox) => (
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={
                                /** Create the label, then refocus the input. */
                                () => {
                                  createLabel();
                                  combobox().focus();
                                }
                              }
                            >
                              <PlusIcon /> {`Create "${command().query}"`}
                            </Button>
                          )
                        }
                      </Command.Context>
                    </EmptyState.Content>
                  </EmptyState.Root>
                </Command.Empty>
              </Command.List>
              <Command.Footer>
                <HStack gap="1.5">
                  <HStack gap="0.5">
                    <Kbd size="sm" variant="subtle">
                      ↑
                    </Kbd>
                    <Kbd size="sm" variant="subtle">
                      ↓
                    </Kbd>
                  </HStack>
                  Navigate
                </HStack>
                <HStack gap="1.5">
                  <Kbd size="sm" variant="subtle">
                    ↵
                  </Kbd>
                  Select
                </HStack>
                <HStack gap="1.5">
                  <Kbd size="sm" variant="subtle">
                    esc
                  </Kbd>
                  Close
                </HStack>
              </Command.Footer>
            </Command.Root>
          </Command.DialogContent>
        </Portal>
      </Command.Dialog>
    </Command.Provider>
  );
}
