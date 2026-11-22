import { createUniqueId, omit } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Menu, Portal, Tooltip } from '../../src';

/** Wrap the first menu item in a right-placed Tooltip. */
export function TooltipWithMenuItem(): JSX.Element {
  return (
    <Menu.Root>
      <Menu.Trigger
        asChild={
          /** Open the menu from its outline button. */
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
            <Tooltip
              ids={{ trigger: 'new-txt' }}
              openDelay={200}
              closeDelay={0}
              positioning={{ placement: 'right' }}
              content="Creates an empty .txt file"
            >
              {
                /** Forward Tooltip hover and focus without replacing Menu selection. */
                (getProps) => {
                  const triggerProps = omit(getProps(), 'onSelect');
                  return (
                    <Menu.Item {...triggerProps} value="new-txt">
                      New text file
                    </Menu.Item>
                  );
                }
              }
            </Tooltip>
            <Menu.Item value="new-file">New file...</Menu.Item>
            <Menu.Item value="new-win">New window</Menu.Item>
            <Menu.Item value="export">Export</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/** Place the Tooltip on the menu's native trigger button. */
export function TooltipWithMenuTrigger(): JSX.Element {
  const triggerId = createUniqueId();
  return (
    <Menu.Root ids={{ trigger: triggerId }}>
      <Tooltip
        ids={{ trigger: triggerId }}
        positioning={{ placement: 'top' }}
        content="Create or export a file"
      >
        {
          /** Compose Tooltip and Menu behavior on the outline button. */
          (tooltipProps) => (
            <Menu.Trigger
              {...tooltipProps()}
              asChild={
                /** Forward both trigger prop sets to the native button. */
                (menuProps) => (
                  <Button {...menuProps()} variant="outline" size="sm">
                    Open
                  </Button>
                )
              }
            />
          )
        }
      </Tooltip>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-txt">New text file</Menu.Item>
            <Menu.Item value="new-file">New file...</Menu.Item>
            <Menu.Item value="new-win">New window</Menu.Item>
            <Menu.Item value="export">Export</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
