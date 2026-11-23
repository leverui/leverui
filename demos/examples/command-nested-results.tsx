import { For, Match, Show, Switch } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { CheckIcon, ChevronRightIcon } from '@lucide/solid';
import {
  Avatar,
  Badge,
  Box,
  Command,
  HStack,
  Status,
  Text,
  type UseCommandCollectionReturn,
} from '../../src';
import type { Issue, Item } from './command-nested-data';

/** Render a choice's status dot, avatar, or icon. */
export function NestedItemIcon(props: { item: Item }): JSX.Element {
  return (
    <Switch fallback={<Dynamic component={props.item.icon} />}>
      <Match when={props.item.colorPalette}>
        {(palette) => (
          <Status.Root colorPalette={palette()} size="sm">
            <Status.Indicator />
          </Status.Root>
        )}
      </Match>
      <Match when={props.item.avatar}>
        <Avatar.Root size="2xs">
          <Avatar.Fallback name={props.item.label} />
        </Avatar.Root>
      </Match>
    </Switch>
  );
}

/** Navigate the issue and its nested Command pages by breadcrumb. */
export function NestedBreadcrumbs(props: {
  command: UseCommandCollectionReturn<Item>;
}): JSX.Element {
  return (
    <HStack
      gap="1"
      textStyle="xs"
      style={{
        'padding-inline': 'var(--lui-spacing-4)',
        'padding-top': 'var(--lui-spacing-3)',
        color: 'var(--lui-colors-fg-muted)',
      }}
    >
      <Badge
        as="button"
        type="button"
        size="sm"
        variant="surface"
        style={{ cursor: 'pointer', 'font-family': 'var(--lui-fonts-mono)' }}
        onClick={() => props.command().setPage(null)}
        onMouseDown={(event: MouseEvent) => event.preventDefault()}
      >
        ENG-142
      </Badge>
      <Show when={props.command().pages.length === 0}>
        <Text truncate style={{ 'margin-inline-start': 'var(--lui-spacing-1)' }}>
          Fix login redirect loop on Safari
        </Text>
      </Show>
      <For each={props.command().pages}>
        {(item, index) => (
          <>
            <ChevronRightIcon />
            <Badge
              as="button"
              type="button"
              size="sm"
              variant={index() === props.command().pages.length - 1 ? 'subtle' : 'plain'}
              style={{ cursor: 'pointer' }}
              onClick={() => props.command().setPage(item.value)}
              onMouseDown={(event: MouseEvent) => event.preventDefault()}
            >
              {item.title ?? item.label}
            </Badge>
          </>
        )}
      </For>
    </HStack>
  );
}

/** Show grouped choices, selection marks, and shortcuts for the active page. */
export function NestedResults(props: {
  command: UseCommandCollectionReturn<Item>;
  issue: Issue;
  keysOf: (hotkey: string) => string[];
}): JSX.Element {
  return (
    <Command.List>
      <For each={props.command().collection.group()}>
        {([group, items]) => (
          <Command.ItemGroup>
            <Show when={group}>
              <Command.ItemGroupLabel>{group}</Command.ItemGroupLabel>
            </Show>
            <For each={items}>
              {(item) => (
                <Command.Item item={item}>
                  <NestedItemIcon item={item} />
                  <Show when={props.command().getPath(item).length > 0}>
                    <HStack
                      gap="1"
                      style={{ color: 'var(--lui-colors-fg-muted)', 'flex-shrink': '0' }}
                    >
                      <For each={props.command().getPath(item)}>
                        {(parent) => (
                          <>
                            {parent.title ?? parent.label}
                            <ChevronRightIcon />
                          </>
                        )}
                      </For>
                    </HStack>
                  </Show>
                  <Command.ItemText highlight>{item.label}</Command.ItemText>
                  <Show
                    when={
                      item.field !== undefined &&
                      [props.issue[item.field]].flat().includes(item.option ?? '')
                    }
                  >
                    <Box style={{ color: 'var(--lui-colors-fg)', 'margin-inline-start': 'auto' }}>
                      <CheckIcon />
                    </Box>
                  </Show>
                  <Show when={props.command().isPage(item) && !item.hotkey}>
                    <Box
                      style={{
                        color: 'var(--lui-colors-fg-subtle)',
                        'margin-inline-start': 'auto',
                      }}
                    >
                      <ChevronRightIcon />
                    </Box>
                  </Show>
                  <Show when={item.hotkey}>
                    {(hotkey) => (
                      <For each={props.keysOf(hotkey())}>
                        {(key) => <Command.ItemCommand>{key}</Command.ItemCommand>}
                      </For>
                    )}
                  </Show>
                </Command.Item>
              )}
            </For>
          </Command.ItemGroup>
        )}
      </For>
      <Command.Empty>No results found</Command.Empty>
    </Command.List>
  );
}
