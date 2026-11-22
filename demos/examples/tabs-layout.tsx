import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FolderIcon, SquareCheckIcon, UserIcon } from '@lucide/solid';
import { SimpleGrid, Tabs, useBreakpointValue } from '../../src';
import './tabs-examples.css';

/** Compare every tab treatment in a two-column grid. */
export function TabsWithVariants(): JSX.Element {
  return (
    <SimpleGrid columns={2} class="example-tabs-grid">
      <For each={['line', 'subtle', 'enclosed', 'outline', 'plain'] as const}>
        {(variant) => (
          <Tabs.Root defaultValue="members" variant={variant}>
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
        )}
      </For>
    </SimpleGrid>
  );
}

/** Switch tabs from horizontal to vertical at the md breakpoint. */
export function TabsResponsiveOrientation(): JSX.Element {
  const orientation = useBreakpointValue<'horizontal' | 'vertical'>({
    base: 'horizontal',
    md: 'vertical',
  });
  return (
    <Tabs.Root variant="subtle" defaultValue="members" orientation={orientation()}>
      <Tabs.List>
        <Tabs.Trigger value="members">Members</Tabs.Trigger>
        <Tabs.Trigger value="projects">Projects</Tabs.Trigger>
        <Tabs.Trigger value="tasks">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="members">Invite people and choose their roles.</Tabs.Content>
      <Tabs.Content value="projects">See each project and who is working on it.</Tabs.Content>
      <Tabs.Content value="tasks">Change your workspace name and time zone.</Tabs.Content>
    </Tabs.Root>
  );
}

/** Compare four teal tab variants in a vertical grid. */
export function TabsVertical(): JSX.Element {
  return (
    <SimpleGrid columns={2} class="example-tabs-grid">
      <For each={['line', 'enclosed', 'outline', 'plain'] as const}>
        {(variant) => (
          <Tabs.Root
            defaultValue="members"
            orientation="vertical"
            variant={variant}
            colorPalette="teal"
          >
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
        )}
      </For>
    </SimpleGrid>
  );
}
