import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Menu, Portal } from '../../src';

/** Show shortcut hints aligned at the end of each file action. */
export function MenuCommand(): JSX.Element {
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
            <Menu.Item value="new-txt-a">
              New text file
              <Menu.ItemCommand>⌘E</Menu.ItemCommand>
            </Menu.Item>
            <Menu.Item value="new-file-a">
              New file...
              <Menu.ItemCommand>⌘N</Menu.ItemCommand>
            </Menu.Item>
            <Menu.Item value="new-win-a">
              New window
              <Menu.ItemCommand>⌘W</Menu.ItemCommand>
            </Menu.Item>
            <Menu.Item value="open-file-a">
              Open file...
              <Menu.ItemCommand>⌘O</Menu.ItemCommand>
            </Menu.Item>
            <Menu.Item value="export-a">
              Export
              <Menu.ItemCommand>⌘S</Menu.ItemCommand>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/** Give the destructive item the error colors. */
export function MenuDangerItem(): JSX.Element {
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
          <Menu.Content>
            <Menu.Item value="rename">Rename</Menu.Item>
            <Menu.Item value="export">Export</Menu.Item>
            <Menu.Item value="delete" class="menu-danger-item">
              Delete...
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/** Split editing actions into labeled style and alignment groups. */
export function MenuGroup(): JSX.Element {
  return (
    <Menu.Root>
      <Menu.Trigger
        asChild={
          /** Keep trigger behavior on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="md">
              Edit
            </Button>
          )
        }
      />
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Styles</Menu.ItemGroupLabel>
              <Menu.Item value="bold">Bold</Menu.Item>
              <Menu.Item value="underline">Underline</Menu.Item>
            </Menu.ItemGroup>
            <Menu.Separator />
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Align</Menu.ItemGroupLabel>
              <Menu.Item value="left">Left</Menu.Item>
              <Menu.Item value="middle">Middle</Menu.Item>
              <Menu.Item value="right">Right</Menu.Item>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/** Render two panels from typed group data. */
export function MenuGroupDynamic(): JSX.Element {
  return (
    <Menu.Root>
      <Menu.Trigger
        asChild={
          /** Keep trigger behavior on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="md">
              Window
            </Button>
          )
        }
      />
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <For each={windowGroups}>
              {
                /** Render one panel and its file actions. */
                (group) => (
                  <Menu.ItemGroup>
                    <Menu.ItemGroupLabel>{group.name}</Menu.ItemGroupLabel>
                    <For each={group.children}>
                      {
                        /** Preserve a file's machine value. */
                        (item) => <Menu.Item value={item.value}>{item.name}</Menu.Item>
                      }
                    </For>
                  </Menu.ItemGroup>
                )
              }
            </For>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

const windowGroups = [
  {
    name: 'Top panel',
    children: [
      { value: '5', name: 'index.html' },
      { value: '6', name: 'styles.css' },
    ],
  },
  {
    name: 'Bottom panel',
    children: [
      { value: '7', name: 'script.js' },
      { value: '8', name: 'assets' },
    ],
  },
] as const;
