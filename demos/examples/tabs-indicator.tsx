import { type JSX } from '@solidjs/web';
import { FolderIcon, SquareCheckIcon, UserIcon } from '@lucide/solid';
import { Tabs } from '../../src';

/** Show plain tabs over a muted list with a moving indicator. */
export function TabsIndicator(): JSX.Element {
  return (
    <Tabs.Root defaultValue="members" variant="plain">
      <Tabs.List
        style={{
          background: 'var(--lui-colors-bg-muted)',
          'border-radius': 'var(--lui-radii-l3)',
          padding: 'var(--lui-spacing-1)',
        }}
      >
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
          Settings
        </Tabs.Trigger>
        <Tabs.Indicator style={{ 'border-radius': 'var(--lui-radii-l2)' }} />
      </Tabs.List>
      <Tabs.Content value="members">Invite people and choose their roles.</Tabs.Content>
      <Tabs.Content value="projects">See each project and who is working on it.</Tabs.Content>
      <Tabs.Content value="tasks">Change your workspace name and time zone.</Tabs.Content>
    </Tabs.Root>
  );
}

/** Customize the plain indicator through the public CSS variables. */
export function TabsCustomIndicator(): JSX.Element {
  return (
    <Tabs.Root
      defaultValue="members"
      variant="plain"
      style={{
        '--lui-tabs-indicator-bg': 'var(--lui-colors-gray-subtle)',
        '--lui-tabs-indicator-shadow': 'var(--lui-shadows-xs)',
        '--lui-tabs-trigger-radius': 'var(--lui-radii-full)',
      }}
    >
      <Tabs.List>
        <Tabs.Trigger value="members">Members</Tabs.Trigger>
        <Tabs.Trigger value="projects">Projects</Tabs.Trigger>
        <Tabs.Trigger value="tasks">Settings</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="members">Invite people and choose their roles.</Tabs.Content>
      <Tabs.Content value="projects">See each project and who is working on it.</Tabs.Content>
      <Tabs.Content value="tasks">Change your workspace name and time zone.</Tabs.Content>
    </Tabs.Root>
  );
}

/** Render every Tabs anatomy part for the guide Explorer. */
export function TabsExplorerDemo(): JSX.Element {
  return (
    <Tabs.Root defaultValue="members">
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
          Settings
        </Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.ContentGroup>
        <Tabs.Content value="members">Invite people and choose their roles.</Tabs.Content>
        <Tabs.Content value="projects">See each project and who is working on it.</Tabs.Content>
        <Tabs.Content value="tasks">Change your workspace name and time zone.</Tabs.Content>
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
}
