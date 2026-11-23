import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { UsersIcon } from '@lucide/solid';
import {
  Avatar,
  Button,
  Command,
  HStack,
  Kbd,
  Portal,
  Spinner,
  Text,
  useCommandCollection,
} from '../../src';
import { searchPeople, type Person } from './command-people-data';

/** Search people with cancellation, loading, and retry feedback. */
export function CommandAsyncContentExample(): JSX.Element {
  const command = useCommandCollection<Person>({
    /** Expose each person's full name to search and highlighting. */
    itemToString: (item) => `${item.firstName} ${item.lastName}`,
    /** Use the record ID as each option's value. */
    itemToValue: (item) => String(item.id),
    /** Skip the simulated request until the user enters a query. */
    load: async ({ query, signal }) => {
      if (!query.trim()) return [];
      const page = await searchPeople({ query, limit: 8, signal });
      return page.results;
    },
  });

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
                  'min-width': 'var(--lui-spacing-64)',
                  'justify-content': 'flex-start',
                  color: 'var(--lui-colors-fg-muted)',
                }}
              >
                <UsersIcon /> Search people...
              </Button>
            )
          }
        />
        <Portal>
          <Command.DialogBackdrop />
          <Command.DialogContent>
            <Command.Root>
              <Command.Label>People search</Command.Label>
              <Command.Control>
                <Command.Indicator />
                <Command.Input placeholder="Search by name, e.g. Priya or Marcus..." />
                <Show when={command().loading}>
                  <Spinner size="sm" style={{ color: 'var(--lui-colors-fg-muted)' }} />
                </Show>
              </Command.Control>
              <Command.List>
                <Command.Loading>Searching people…</Command.Loading>
                <For each={command().collection.items}>
                  {
                    /** Render each result with its initials avatar and title. */
                    (user) => (
                      <Command.Item item={user}>
                        <Avatar.Root size="2xs">
                          <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
                        </Avatar.Root>
                        <Command.ItemText highlight>
                          {`${user.firstName} ${user.lastName}`}
                        </Command.ItemText>
                        <Text
                          truncate
                          textStyle="xs"
                          style={{
                            'margin-inline-start': 'auto',
                            color: 'var(--lui-colors-fg-muted)',
                          }}
                        >
                          {user.title}
                        </Text>
                      </Command.Item>
                    )
                  }
                </For>
                <Show
                  when={command().error}
                  fallback={
                    <Command.Empty>
                      {command().query ? 'No people found' : 'Start typing to search'}
                    </Command.Empty>
                  }
                >
                  <Text
                    role="alert"
                    textStyle="sm"
                    style={{
                      'padding-inline': 'var(--lui-spacing-3)',
                      'padding-block': 'var(--lui-spacing-6)',
                      'text-align': 'center',
                      color: 'var(--lui-colors-fg-muted)',
                    }}
                  >
                    Search failed.{' '}
                    <Button size="xs" variant="plain" onClick={() => command().reload()}>
                      Try again
                    </Button>
                  </Text>
                </Show>
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
