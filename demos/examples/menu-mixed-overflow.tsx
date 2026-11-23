import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  ClipboardIcon,
  CopyIcon,
  FileSearchIcon,
  MessageSquareIcon,
  ScissorsIcon,
  ShareIcon,
} from '@lucide/solid';
import { Button, Group, Menu, Portal } from '../../src';

const horizontalMenuItems = [
  { label: 'Cut', value: 'cut', icon: ScissorsIcon },
  { label: 'Copy', value: 'copy', icon: CopyIcon },
  { label: 'Paste', value: 'paste', icon: ClipboardIcon },
] as const;

const verticalMenuItems = [
  { label: 'Look up', value: 'look-up', icon: FileSearchIcon },
  { label: 'Translate', value: 'translate', icon: MessageSquareIcon },
  { label: 'Share', value: 'share', icon: ShareIcon },
] as const;

/** Put three compact actions above three full-width actions. */
export function MenuMixedLayout(): JSX.Element {
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
            <Group grow style={{ '--lui-group-gap': '0px' }}>
              <For each={horizontalMenuItems}>
                {
                  /** Stack each compact action's icon and label. */
                  (item) => (
                    <Menu.Item
                      value={item.value}
                      style={{
                        width: 'var(--lui-sizes-14)',
                        gap: 'var(--lui-spacing-1)',
                        'flex-direction': 'column',
                        'justify-content': 'center',
                      }}
                    >
                      <item.icon />
                      {item.label}
                    </Menu.Item>
                  )
                }
              </For>
            </Group>
            <For each={verticalMenuItems}>
              {
                /** Keep each full-width action icon on the right. */
                (item) => (
                  <Menu.Item value={item.value}>
                    <span style={{ flex: '1' }}>{item.label}</span>
                    <item.icon />
                  </Menu.Item>
                )
              }
            </For>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/** Keep the long list scrollable within 200 pixels. */
export function MenuOverflow(): JSX.Element {
  return (
    <Menu.Root>
      <Menu.Trigger
        asChild={
          /** Keep trigger behavior on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open menu
            </Button>
          )
        }
      />
      <Portal>
        <Menu.Positioner>
          <Menu.Content style={{ 'max-height': '200px', 'min-width': '10rem' }}>
            <For each={menuItems}>
              {
                /** Give each list entry a stable selection value. */
                (item) => <Menu.Item value={item.value}>{item.label}</Menu.Item>
              }
            </For>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

const menuItems = [
  { value: 'new-file', label: 'New file' },
  { value: 'new-folder', label: 'New folder' },
  { value: 'open', label: 'Open...' },
  { value: 'open-recent', label: 'Open recent' },
  { value: 'save', label: 'Save' },
  { value: 'save-as', label: 'Save as...' },
  { value: 'save-all', label: 'Save all' },
  { value: 'export', label: 'Export' },
  { value: 'import', label: 'Import' },
  { value: 'print', label: 'Print' },
  { value: 'share', label: 'Share' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to...' },
  { value: 'copy', label: 'Copy to...' },
  { value: 'delete', label: 'Delete' },
  { value: 'find', label: 'Find' },
  { value: 'replace', label: 'Replace' },
  { value: 'preferences', label: 'Preferences' },
  { value: 'settings', label: 'Settings' },
  { value: 'help', label: 'Help' },
  { value: 'about', label: 'About' },
  { value: 'quit', label: 'Quit' },
] as const;
