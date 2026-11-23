import { createMemo, createSignal, For, Show, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CopyIcon, MailIcon, PencilIcon, SearchIcon, SendIcon, TrashIcon } from '@lucide/solid';
import {
  Badge,
  Button,
  Command,
  HStack,
  Kbd,
  Portal,
  Stack,
  Text,
  useCommandCollection,
  type CommandItem,
} from '../../src';

interface Item extends CommandItem {
  label: string;
  value: string;
  icon: Component;
  title?: string;
  placeholder?: string;
  hint?: string;
}

const actions: Item[] = [
  {
    label: 'Rename issue...',
    value: 'rename',
    page: true,
    title: 'Rename',
    placeholder: 'Type a new title...',
    hint: 'Type a new title, then press Enter',
    icon: PencilIcon,
  },
  {
    label: 'Invite by email...',
    value: 'invite',
    page: true,
    title: 'Invite',
    placeholder: 'name@company.com',
    hint: 'Type an email address to send an invite',
    icon: MailIcon,
  },
  { label: 'Copy issue link', value: 'copy', icon: CopyIcon },
  { label: 'Delete issue', value: 'delete', icon: TrashIcon },
];

/** Demonstrate nested rename and invite pages driven by input text. */
export function CommandInputPageExample(): JSX.Element {
  const [title, setTitle] = createSignal('Fix login redirect loop on Safari');
  const [invited, setInvited] = createSignal<string[]>([]);
  const [query, setQuery] = createSignal('');
  const items = createMemo(
    /** Add the actions that the current input-page query makes valid. */
    () => {
      const text = query().trim();
      const result = [...actions];
      if (text) {
        result.push({
          label: `Rename to "${text}"`,
          value: 'rename:apply',
          parent: 'rename',
          icon: PencilIcon,
          /** Apply the title captured when this result was built. */
          onSelect: () => setTitle(text),
        });
      }
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
        result.push({
          label: `Send invite to ${text}`,
          value: 'invite:send',
          parent: 'invite',
          icon: SendIcon,
          /** Append the entered email to the invite list. */
          onSelect: () => setInvited((current) => [...current, text]),
        });
      }
      return result;
    },
  );
  const command = useCommandCollection<Item>(
    /** Synchronize the dynamic items with the controlled query. */
    () => ({ initialItems: items(), query: query(), onQueryChange: setQuery }),
  );
  /** Follow the currently open nested page. */
  const page = () => command().page;

  return (
    <Stack gap="4" align="flex-start">
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
                  <SearchIcon /> Search actions...
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
                    {
                      /** Show the active page title ahead of the input. */
                      (current) => (
                        <Badge size="sm" variant="subtle" style={{ 'flex-shrink': '0' }}>
                          {current().title}
                        </Badge>
                      )
                    }
                  </Show>
                  <Command.Input
                    placeholder={page()?.placeholder ?? 'Type a command or search...'}
                  />
                </Command.Control>
                <Command.List>
                  <For each={command().collection.items}>
                    {
                      /** Render only the actions on the current page. */
                      (item) => (
                        <Command.Item item={item}>
                          <item.icon />
                          <Command.ItemText highlight={!page()}>{item.label}</Command.ItemText>
                        </Command.Item>
                      )
                    }
                  </For>
                  <Command.Empty>{page()?.hint ?? 'No results found'}</Command.Empty>
                </Command.List>
                <Command.Footer>
                  <HStack gap="1.5">
                    <Kbd size="sm" variant="subtle">
                      ↵
                    </Kbd>
                    {page() ? 'Confirm' : 'Select'}
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
      <Stack gap="1" textStyle="sm">
        <Text style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>{title()}</Text>
        <Text style={{ color: 'var(--lui-colors-fg-muted)' }}>
          {invited().length ? `Invited ${invited().join(', ')}` : 'No invites yet'}
        </Text>
      </Stack>
    </Stack>
  );
}
