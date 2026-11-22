import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Code, Menu, Portal, Stack, useMenu } from '../../src';

/** Show the five-item menu. */
export function MenuBasic(): JSX.Element {
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
            <Menu.Item value="new-win">New window</Menu.Item>
            <Menu.Item value="open-file">Open file...</Menu.Item>
            <Menu.Item value="export">Export</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/** Mirror the menu's open state in a live Code label. */
export function MenuControlled(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  return (
    <Stack gap="4" align="flex-start">
      <Code>open: {String(open())}</Code>
      <Menu.Root
        open={open()}
        onOpenChange={
          /** Keep the caller-owned state aligned with the menu. */
          (details) => setOpen(details.open)
        }
      >
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
              <Menu.Item value="new-win">New window</Menu.Item>
              <Menu.Item value="open-file">Open file...</Menu.Item>
              <Menu.Item value="export">Export</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Stack>
  );
}

/** Expose the external menu machine's current open state. */
export function MenuWithStore(): JSX.Element {
  const menu = useMenu({ defaultOpen: false });
  return (
    <Stack gap="4" align="flex-start">
      <Code>open: {String(menu.api().open)}</Code>
      <Menu.RootProvider value={menu}>
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
              <Menu.Item value="new-win">New window</Menu.Item>
              <Menu.Item value="open-file">Open file...</Menu.Item>
              <Menu.Item value="export">Export</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.RootProvider>
    </Stack>
  );
}

/** Open a five-item menu to the right of its trigger. */
export function MenuPlacement(): JSX.Element {
  return (
    <Menu.Root positioning={{ placement: 'right-start' }}>
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
            <Menu.Item value="new-win">New window</Menu.Item>
            <Menu.Item value="open-file">Open file...</Menu.Item>
            <Menu.Item value="export">Export</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
