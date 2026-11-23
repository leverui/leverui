import { type JSX } from '@solidjs/web';
import { Avatar, Button, Center, Menu, Portal } from '../../src';

/** Position the menu against the visible Anchor box instead of its trigger. */
export function MenuAnchorRect(): JSX.Element {
  let anchor!: HTMLDivElement;
  /** Return the current anchor bounds after it is mounted. */
  const getAnchorRect = (): DOMRect => anchor.getBoundingClientRect();

  return (
    <Menu.Root positioning={{ getAnchorRect }}>
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
      <div
        ref={anchor}
        style={{
          background: 'var(--lui-colors-bg-subtle)',
          padding: 'var(--lui-spacing-4)',
          'margin-top': 'var(--lui-spacing-4)',
        }}
      >
        Anchor
      </div>
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

/** Use the profile avatar itself as the menu trigger. */
export function MenuWithAvatar(): JSX.Element {
  return (
    <Menu.Root positioning={{ placement: 'right-end' }}>
      <Menu.Trigger class="menu-avatar-trigger">
        <Avatar.Root size="sm">
          <Avatar.Fallback name="Mara Ellison" />
          <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
        </Avatar.Root>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="account">Account</Menu.Item>
            <Menu.Item value="settings">Settings</Menu.Item>
            <Menu.Item value="logout">Log out</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/** Open file actions from a right-click target. */
export function MenuContextTrigger(): JSX.Element {
  return (
    <Menu.Root>
      <Menu.ContextTrigger style={{ width: '100%' }}>
        <Center
          style={{
            height: 'var(--lui-sizes-40)',
            'user-select': 'none',
            border: '2px dashed var(--lui-colors-border)',
            'border-radius': 'var(--lui-radii-lg)',
            padding: 'var(--lui-spacing-4)',
          }}
        >
          Right click here
        </Center>
      </Menu.ContextTrigger>
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
