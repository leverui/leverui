import { type JSX } from '@solidjs/web';
import { FolderIcon, SquareCheckIcon, UserIcon } from '@lucide/solid';
import { Tabs } from '../../src';

/** Show icon tabs and their corresponding content. */
export function TabsBasic(): JSX.Element {
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
      </Tabs.List>
      <Tabs.Content value="members">Invite people and choose their roles.</Tabs.Content>
      <Tabs.Content value="projects">See each project and who is working on it.</Tabs.Content>
      <Tabs.Content value="tasks">Change your workspace name and time zone.</Tabs.Content>
    </Tabs.Root>
  );
}

/** Show the disabled project tab without a content panel. */
export function TabsDisabledTab(): JSX.Element {
  return (
    <Tabs.Root defaultValue="members">
      <Tabs.List>
        <Tabs.Trigger value="members">
          <UserIcon />
          Members
        </Tabs.Trigger>
        <Tabs.Trigger value="projects" disabled>
          <FolderIcon />
          Projects
        </Tabs.Trigger>
        <Tabs.Trigger value="tasks">
          <SquareCheckIcon />
          Settings
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
}

/** Show manual activation when keyboard focus moves between tabs. */
export function TabsManualActivation(): JSX.Element {
  return (
    <Tabs.Root defaultValue="members" activationMode="manual">
      <Tabs.List>
        <Tabs.Trigger value="members">
          <UserIcon />
          Members
        </Tabs.Trigger>
        <Tabs.Trigger value="projects" disabled>
          <FolderIcon />
          Projects
        </Tabs.Trigger>
        <Tabs.Trigger value="tasks">
          <SquareCheckIcon />
          Settings
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
}
