import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FolderIcon, PlusIcon, SquareCheckIcon, UserIcon } from '@lucide/solid';
import {
  Button,
  CloseButton,
  Code,
  Heading,
  Stack,
  Tabs,
  Text,
  useTabs,
  type TabsValueChangeDetails,
} from '../../src';

interface DynamicTab {
  readonly id: string;
  readonly title: string;
  readonly content: string;
}

const initialTabs: readonly DynamicTab[] = [
  { id: '1', title: 'Tab', content: 'Tab content' },
  { id: '2', title: 'Tab', content: 'Tab content' },
  { id: '3', title: 'Tab', content: 'Tab content' },
  { id: '4', title: 'Tab', content: 'Tab content' },
];

/** Add and remove tab panels while preserving the caller-owned selection. */
export function TabsDynamicAdd(): JSX.Element {
  const [tabs, setTabs] = createSignal<readonly DynamicTab[]>(initialTabs);
  const [selectedTab, setSelectedTab] = createSignal<string | null>('1');

  /** Select a tab after its active value changes. */
  function updateSelection(details: TabsValueChangeDetails): void {
    setSelectedTab(details.value);
  }

  /** Append a tab with a unique browser-generated id and select it. */
  function addTab(): void {
    const id = Math.random().toString(36).substring(2, 15);
    setTabs(
      /** Append after the currently rendered tabs. */
      (current) => [...current, { id, title: 'Tab', content: 'Tab body' }],
    );
    setSelectedTab(id);
  }

  /** Remove a tab while leaving at least one panel available. */
  function removeTab(id: string): void {
    setTabs(
      /** Preserve the last tab and remove the requested id otherwise. */
      (current) =>
        current.length > 1
          ? current.filter(
              /** Keep tabs other than the one being closed. */
              (tab) => tab.id !== id,
            )
          : current,
    );
  }

  return (
    <Tabs.Root value={selectedTab()} variant="outline" size="sm" onValueChange={updateSelection}>
      <Tabs.List style={{ flex: '1 1 auto' }}>
        <For each={tabs()}>
          {
            /** Pair each dynamic trigger with its close action. */
            (item) => {
              /** Stop the close control from selecting its parent tab. */
              function remove(event: MouseEvent): void {
                event.stopPropagation();
                removeTab(item.id);
              }
              return (
                <Tabs.Trigger value={item.id}>
                  {item.title}{' '}
                  <CloseButton
                    as="span"
                    role="button"
                    size="2xs"
                    style={{ 'margin-inline-end': 'calc(-1 * var(--leverui-spacing-2))' }}
                    onClick={remove}
                  />
                </Tabs.Trigger>
              );
            }
          }
        </For>
        <Button
          style={{ 'align-self': 'center', 'margin-inline-start': 'var(--leverui-spacing-2)' }}
          size="2xs"
          variant="ghost"
          onClick={addTab}
        >
          <PlusIcon /> Add tab
        </Button>
      </Tabs.List>
      <Tabs.ContentGroup>
        <For each={tabs()}>
          {
            /** Render one panel for each dynamic tab. */
            (item) => (
              <Tabs.Content value={item.id}>
                <Heading size="xl" style={{ 'margin-block': 'var(--leverui-spacing-6)' }}>
                  {item.content} {item.id}
                </Heading>
                <Text>
                  Each tab here has its own panel. Press the plus button to add a tab, and it opens
                  straight away. Press the small close button on a tab to remove it. You cannot
                  remove the last tab, so there is always one panel to show.
                </Text>
              </Tabs.Content>
            )
          }
        </For>
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
}

/** Expose the current value of an externally owned Tabs machine. */
export function TabsStore(): JSX.Element {
  const tabs = useTabs({ defaultValue: 'members' });
  return (
    <Stack align="flex-start">
      <Code>selected: {tabs().value}</Code>
      <Tabs.RootProvider value={tabs}>
        <Tabs.List>
          <Tabs.Trigger value="members">
            <UserIcon />
            Members
          </Tabs.Trigger>
          <Tabs.Trigger value="projects">
            <FolderIcon />
            Projects
          </Tabs.Trigger>
          <Tabs.Trigger value="tasks">
            <SquareCheckIcon />
            Tasks
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="members">Invite people and choose their roles.</Tabs.Content>
        <Tabs.Content value="projects">See each project and who is working on it.</Tabs.Content>
        <Tabs.Content value="tasks">Track open tasks and their due dates.</Tabs.Content>
      </Tabs.RootProvider>
    </Stack>
  );
}
