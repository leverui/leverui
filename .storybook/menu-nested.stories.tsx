import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  MenuContent,
  MenuContextTrigger,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  MenuTriggerItem,
  Portal,
} from '../src';

/** Exercise nested primitive menu machines with independently scoped appearance. */
function NestedMenuExample(): JSX.Element {
  return (
    <>
      <MenuRoot>
        <MenuTrigger data-testid="nested-menu-trigger">Actions</MenuTrigger>
        <Portal>
          <MenuPositioner>
            <MenuContent data-testid="nested-parent-content">
              <MenuItem value="rename">Rename</MenuItem>
              <MenuRoot size="sm">
                <MenuTriggerItem data-testid="nested-menu-item">More actions</MenuTriggerItem>
                <Portal>
                  <MenuPositioner>
                    <MenuContent data-testid="nested-child-content">
                      <MenuItem value="duplicate" data-testid="nested-child-item">
                        Duplicate
                      </MenuItem>
                    </MenuContent>
                  </MenuPositioner>
                </Portal>
              </MenuRoot>
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </MenuRoot>
    </>
  );
}

/** Exercise context-menu activation without a standard trigger. */
function ContextMenuExample(): JSX.Element {
  return (
    <>
      <MenuRoot>
        <MenuContextTrigger data-testid="context-menu-trigger">Right click here</MenuContextTrigger>
        <Portal>
          <MenuPositioner>
            <MenuContent data-testid="context-menu-content">
              <MenuItem value="inspect" data-testid="context-menu-item">
                Inspect
              </MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </MenuRoot>
    </>
  );
}

const meta = {
  title: 'Components/Menu Nested',
  component: NestedMenuExample,
} satisfies Meta<typeof NestedMenuExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nested: Story = {};
export const Context: Story = { render: ContextMenuExample };
