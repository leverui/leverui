import { type JSX } from '@solidjs/web';
import { FolderIcon, SquareCheckIcon, UserIcon } from '@lucide/solid';
import { Tabs, Tooltip } from '../../src';

/** Put the Tooltip on a wrapper around the Members tab. */
export function TooltipWithTab(): JSX.Element {
  return (
    <Tabs.Root defaultValue="members">
      <Tabs.List>
        <Tooltip
          positioning={{ placement: 'top' }}
          ids={{ trigger: 'members' }}
          content="See who is on your team"
        >
          {
            /** Wrap the tab so the two trigger machines stay separate. */
            (getProps) => (
              <span {...getProps()}>
                <Tabs.Trigger value="members">
                  <UserIcon /> Members
                </Tabs.Trigger>
              </span>
            )
          }
        </Tooltip>
        <Tabs.Trigger value="projects">
          <FolderIcon /> Projects
        </Tabs.Trigger>
        <Tabs.Trigger value="tasks">
          <SquareCheckIcon /> Tasks
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="members">Invite people and set their roles.</Tabs.Content>
      <Tabs.Content value="projects">Create projects and archive old ones.</Tabs.Content>
      <Tabs.Content value="tasks">Assign tasks and track their progress.</Tabs.Content>
    </Tabs.Root>
  );
}
