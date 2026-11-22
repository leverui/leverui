import { type JSX } from '@solidjs/web';
import { ChevronDownIcon, ChevronRightIcon } from '@lucide/solid';
import { Button, Menu } from '../../src';

/** Keep every Menu part open and unportaled for the anatomy Explorer. */
export function MenuExplorerDemo(): JSX.Element {
  return (
    <div
      style={{
        'min-height': '380px',
        width: '100%',
        display: 'grid',
        gap: '12px',
        'align-content': 'start',
      }}
    >
      <Menu.Root>
        <Menu.ContextTrigger style={{ width: '100%', padding: '8px' }}>
          Right click here
        </Menu.ContextTrigger>
      </Menu.Root>
      <Menu.Root open positioning={{ placement: 'bottom-start' }}>
        <Menu.Trigger
          asChild={
            /** Keep trigger behavior on the outline button. */
            (getProps) => (
              <Button {...getProps()} variant="outline" size="sm" style={{ width: 'fit-content' }}>
                Open
                <Menu.Indicator>
                  <ChevronDownIcon />
                </Menu.Indicator>
              </Button>
            )
          }
        />
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Arrow>
              <Menu.ArrowTip />
            </Menu.Arrow>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Files</Menu.ItemGroupLabel>
              <Menu.Item value="new-txt">
                <Menu.ItemText>New text file</Menu.ItemText>
                <Menu.ItemCommand>⌘E</Menu.ItemCommand>
              </Menu.Item>
              <Menu.Item value="new-file">New file...</Menu.Item>
            </Menu.ItemGroup>
            <Menu.Separator />
            <Menu.CheckboxItem value="autosave" checked>
              Autosave
              <Menu.ItemIndicator />
            </Menu.CheckboxItem>
            <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }}>
              <Menu.TriggerItem>
                Open recent <ChevronRightIcon />
              </Menu.TriggerItem>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="harbor-notes">Harbor notes</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </div>
  );
}
