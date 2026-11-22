import { createSignal, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { SearchIcon } from '@lucide/solid';
import {
  Button,
  Command,
  HStack,
  Kbd,
  Portal,
  Stack,
  Text,
  useCommandCollection,
  useFormatHotkey,
  useHotkeys,
} from '../../src';
import { initialIssue, items, shortcuts, type Item } from './command-nested-data';
import { NestedBreadcrumbs, NestedResults } from './command-nested-results';
import { NestedShortcuts, NestedSummary } from './command-nested-summary';

/** Edit an issue through a deep-search Command palette and nested pages. */
export function CommandNestedExample(): JSX.Element {
  const [issue, setIssue] = createSignal(initialIssue);
  const [open, setOpen] = createSignal(false);
  const [copied, setCopied] = createSignal<string>();
  const [copyError, setCopyError] = createSignal(false);
  const command = useCommandCollection<Item>({
    initialItems: items,
    /** Group root actions while child choices stay unlabelled. */
    groupBy: (item) => item.group ?? '',
    deepSearch: true,
  });
  const formatHotkey = useFormatHotkey();

  /** Acknowledge a copy only after the browser writes to the clipboard. */
  async function copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setCopyError(false);
    } catch {
      setCopied(undefined);
      setCopyError(true);
    }
  }

  /** Split a platform-specific chord into key caps. */
  function keysOf(hotkey: string): string[] {
    return formatHotkey(hotkey).split(' ');
  }

  useHotkeys({
    commands: shortcuts.map((item) => ({
      id: `nested:${item.value}`,
      hotkey: item.hotkey,
      label: item.label,
      /** Open the shortcut's page or copy its value. */
      action: () => {
        if (command().isPage(item)) {
          command().reset(item.value);
          setOpen(true);
        } else if (item.copy) void copy(item.copy);
      },
      options: { preventDefault: true },
    })),
  });

  /** Apply the selected issue field or copy action. */
  function selectItem(details: { itemValue: string }): void {
    const item = items.find((candidate) => candidate.value === details.itemValue);
    if (item?.copy) void copy(item.copy);
    const field = item?.field;
    const option = item?.option;
    if (!field || !option) return;
    setIssue(
      /** Replace the field's value, or toggle the label. */
      (current) => {
        if (field !== 'labels') return { ...current, [field]: option };
        const labels = current.labels.includes(option)
          ? current.labels.filter((value) => value !== option)
          : [...current.labels, option];
        return { ...current, labels };
      },
    );
  }

  return (
    <Stack gap="6" align="flex-start">
      <Command.Provider value={command}>
        <Command.Dialog open={open()} onOpenChange={(details) => setOpen(details.open)}>
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
                  <SearchIcon /> Search actions...
                </Button>
              )
            }
          />
          <Portal>
            <Command.DialogBackdrop />
            <Command.DialogContent>
              <Command.Root onSelect={selectItem}>
                <NestedBreadcrumbs command={command} />
                <Command.Control>
                  <Command.Indicator />
                  <Command.Input
                    placeholder={command().page?.placeholder ?? 'Type a command or search...'}
                  />
                </Command.Control>
                <NestedResults command={command} issue={issue()} keysOf={keysOf} />
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
                    {command().page?.value === 'labels' ? 'Toggle' : 'Select'}
                  </HStack>
                  <HStack gap="1.5">
                    <Kbd size="sm" variant="subtle">
                      {command().page ? '⌫' : 'esc'}
                    </Kbd>
                    {command().page ? 'Back' : 'Close'}
                  </HStack>
                </Command.Footer>
              </Command.Root>
            </Command.DialogContent>
          </Portal>
        </Command.Dialog>
      </Command.Provider>
      <NestedSummary issue={issue()} />
      <NestedShortcuts keysOf={keysOf} />
      <Show when={copied()}>
        <Text
          textStyle="sm"
          style={{
            color: 'var(--leverui-colors-fg-muted)',
          }}
        >
          Copied {copied()} to clipboard
        </Text>
      </Show>
      <Show when={copyError()}>
        <Text
          role="alert"
          textStyle="sm"
          style={{
            color: 'var(--leverui-colors-fg-error)',
          }}
        >
          Could not copy to clipboard
        </Text>
      </Show>
    </Stack>
  );
}
