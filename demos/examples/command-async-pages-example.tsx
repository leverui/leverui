import { For, Match, Show, Switch } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { ChevronRightIcon, PackageIcon, SearchIcon } from '@lucide/solid';
import {
  Avatar,
  Badge,
  Button,
  Command,
  HStack,
  Kbd,
  Portal,
  Spinner,
  Text,
  useCommandCollection,
} from '../../src';
import { items, type Item } from './command-async-pages-data';
import { searchPeople, searchProducts } from './command-people-data';

/** Search separate people and product catalogs inside nested pages. */
export function CommandAsyncPagesExample(): JSX.Element {
  const command = useCommandCollection<Item>({
    initialItems: items,
    /** Search only when a catalog page is active. */
    load: async ({ page, query, signal }) => {
      if (page?.value === 'people') {
        const result = await searchPeople({ query, limit: 8, signal });
        return result.results.map(
          /** Present each person as a nested-page result. */
          (person): Item => ({
            label: `${person.firstName} ${person.lastName}`,
            value: `person:${person.id}`,
            description: person.title,
            kind: 'person',
          }),
        );
      }
      if (page?.value === 'products') {
        const result = await searchProducts({ query, limit: 8, signal });
        return result.results.map(
          /** Present each product with its price. */
          (product): Item => ({
            label: product.title,
            value: `product:${product.id}`,
            description: `$${product.price}`,
            kind: 'product',
          }),
        );
      }
      return [];
    },
  });
  /** Follow the current nested search page. */
  const page = () => command().page;

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
                <SearchIcon /> Search...
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
                <Show when={page()}>
                  {(current) => (
                    <Badge size="sm" variant="subtle" style={{ 'flex-shrink': '0' }}>
                      {current().title}
                    </Badge>
                  )}
                </Show>
                <Command.Input placeholder={page()?.placeholder ?? 'Type a command or search...'} />
                <Show when={command().loading}>
                  <Spinner size="sm" style={{ color: 'var(--lui-colors-fg-muted)' }} />
                </Show>
              </Command.Control>
              <Command.List>
                <Show when={command().collection.size === 0}>
                  <Command.Loading>Loading {page()?.title?.toLowerCase()}...</Command.Loading>
                </Show>
                <For each={command().collection.items}>
                  {
                    /** Show page actions or catalog results. */
                    (item) => (
                      <Command.Item item={item}>
                        <Switch fallback={<Dynamic component={item.icon} />}>
                          <Match when={item.kind === 'person'}>
                            <Avatar.Root size="2xs">
                              <Avatar.Fallback name={item.label} />
                            </Avatar.Root>
                          </Match>
                          <Match when={item.kind === 'product'}>
                            <PackageIcon
                              aria-hidden="true"
                              style={{
                                width: 'var(--lui-spacing-5)',
                                height: 'var(--lui-spacing-5)',
                              }}
                            />
                          </Match>
                        </Switch>
                        <Command.ItemText highlight>{item.label}</Command.ItemText>
                        <Show when={item.description}>
                          <Text
                            truncate
                            textStyle="xs"
                            style={{
                              'margin-inline-start': 'auto',
                              color: 'var(--lui-colors-fg-muted)',
                            }}
                          >
                            {item.description}
                          </Text>
                        </Show>
                        <Show when={command().isPage(item)}>
                          <ChevronRightIcon />
                        </Show>
                      </Command.Item>
                    )
                  }
                </For>
                <Show
                  when={command().error}
                  fallback={<Command.Empty>No results found</Command.Empty>}
                >
                  <Command.Empty>
                    Couldn't load results.{' '}
                    <Button size="xs" variant="plain" onClick={() => command().reload()}>
                      Retry
                    </Button>
                  </Command.Empty>
                </Show>
              </Command.List>
              <Command.Footer>
                <HStack gap="1.5">
                  <Kbd size="sm" variant="subtle">
                    ↵
                  </Kbd>
                  Select
                </HStack>
                <HStack gap="1.5">
                  <Kbd size="sm" variant="subtle">
                    {page() ? '⌫' : 'esc'}
                  </Kbd>
                  {page() ? 'Back' : 'Close'}
                </HStack>
              </Command.Footer>
            </Command.Root>
          </Command.DialogContent>
        </Portal>
      </Command.Dialog>
    </Command.Provider>
  );
}
