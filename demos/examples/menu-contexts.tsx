import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Center, Dialog, Flex, Menu, Portal, Text } from '../../src';

/** Hide an open menu when horizontal scrolling detaches its trigger. */
export function MenuHideWhenDetached(): JSX.Element {
  return (
    <Center style={{ 'min-height': 'var(--lui-sizes-sm)' }}>
      <Flex
        style={{
          width: '300px',
          height: '100%',
          'overflow-x': 'auto',
          'column-gap': 'var(--lui-spacing-6)',
          padding: 'var(--lui-spacing-4)',
          'border-width': '1px',
          background: 'var(--lui-colors-bg-subtle)',
        }}
      >
        <For each={[0, 1, 2, 3, 4, 5]}>
          {
            /** Fill the scroll rail with six cards. */
            (index) => (
              <div
                style={{
                  background: 'var(--lui-colors-bg-panel)',
                  padding: 'var(--lui-spacing-4)',
                  'border-radius': 'var(--lui-radii-md)',
                }}
              >
                <Text>Item{index}</Text>
              </div>
            )
          }
        </For>
        <div>
          <Menu.Root positioning={{ hideWhenDetached: true }}>
            <Menu.Trigger
              asChild={
                /** Preserve trigger behavior on the green box. */
                (getProps) => (
                  <button
                    {...getProps()}
                    style={{
                      background: 'var(--lui-colors-green-100)',
                      padding: 'var(--lui-spacing-4)',
                      'border-radius': 'var(--lui-radii-md)',
                    }}
                  >
                    Menu
                  </button>
                )
              }
            />
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="new-txt">New text file</Menu.Item>
                  <Menu.Item value="new-file">New file...</Menu.Item>
                  <Menu.Item value="new-win">New window</Menu.Item>
                  <Menu.Item value="open-file">Open file...</Menu.Item>
                  <Menu.Item value="export">Export</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>
      </Flex>
    </Center>
  );
}

/** Open a nested menu from within a modal dialog. */
export function MenuOpenFromDialog(): JSX.Element {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        asChild={
          /** Forward dialog activation to its outline trigger. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Welcome to the menu</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              style={{
                display: 'flex',
                'flex-direction': 'column',
                gap: 'var(--lui-spacing-4)',
              }}
            >
              <DialogMenu />
              <p>
                This dialog has a menu inside it. Use the Menu button above to open the menu and
                choose a file action. The menu is rendered inside the dialog, not at the end of the
                page. This keeps keyboard focus within the dialog while the menu is open.
              </p>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

/** Keep the child menu inside the modal dialog's focus scope. */
function DialogMenu(): JSX.Element {
  return (
    <Menu.Root>
      <Menu.Trigger
        asChild={
          /** Keep trigger behavior on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Menu
            </Button>
          )
        }
      />
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item value="new-txt">New text file</Menu.Item>
          <Menu.Item value="new-file">New file...</Menu.Item>
          <Menu.Item value="new-win">New window</Menu.Item>
          <Menu.Item value="open-file">Open file...</Menu.Item>
          <Menu.Item value="export">Export</Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
