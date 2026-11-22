import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronRightIcon } from '@lucide/solid';
import { Button, Menu, Portal } from '../../src';

/** Show the one-level recent-file submenu. */
export function MenuSubmenu(): JSX.Element {
  return (
    <Menu.Root>
      <Menu.Trigger
        asChild={
          /** Keep trigger behavior on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open
            </Button>
          )
        }
      />
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-txt">New text file</Menu.Item>
            <Menu.Item value="new-file">New file...</Menu.Item>
            <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }}>
              <Menu.TriggerItem>
                Open recent <ChevronRightIcon />
              </Menu.TriggerItem>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="harbor-notes">Harbor notes</Menu.Item>
                    <Menu.Item value="field-guide">Field guide</Menu.Item>
                    <Menu.Item value="leverui">Lever UI v3</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            <Menu.Item value="open-file">Open file...</Menu.Item>
            <Menu.Item value="export">Export</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

interface NestedAction {
  readonly value: string;
  readonly label: string;
  readonly children?: readonly NestedAction[];
}

const nestedActions: readonly NestedAction[] = [
  { value: 'new-txt', label: 'New text file' },
  { value: 'new-file', label: 'New file...' },
  {
    value: 'open-recent',
    label: 'Open recent',
    children: [
      { value: 'harbor-notes', label: 'Harbor notes' },
      { value: 'field-guide', label: 'Field guide' },
      {
        value: 'leverui',
        label: 'Lever UI v3',
        children: [
          { value: 'leverui-1', label: 'Lever UI v3.1' },
          { value: 'leverui-2', label: 'Lever UI v3.2' },
        ],
      },
    ],
  },
  { value: 'open-file', label: 'Open file...' },
  { value: 'export', label: 'Export' },
];

/** Render either an action or its nested menu from the same data tree. */
function NestedMenuItem(props: { item: NestedAction }): JSX.Element {
  return (
    <Show
      when={props.item.children}
      fallback={<Menu.Item value={props.item.value}>{props.item.label}</Menu.Item>}
    >
      <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }}>
        <Menu.TriggerItem>
          {props.item.label} <ChevronRightIcon />
        </Menu.TriggerItem>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <For each={props.item.children}>
                {
                  /** Recurse only when the current action owns child items. */
                  (child) => <NestedMenuItem item={child} />
                }
              </For>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Show>
  );
}

/** Render the three-level recent-file menu. */
export function MenuSubmenuDynamic(): JSX.Element {
  return (
    <Menu.Root>
      <Menu.Trigger
        asChild={
          /** Keep trigger behavior on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="md">
              Nested
            </Button>
          )
        }
      />
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <For each={nestedActions}>
              {
                /** Preserve each root action's nested structure. */
                (item) => <NestedMenuItem item={item} />
              }
            </For>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
