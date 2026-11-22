import { createUniqueId, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Menu, Portal, ScrollArea } from '../src';

const menuItems = Array.from(
  { length: 24 },
  /** Give keyboard navigation a full scrollable collection. */
  (_, index) => ({ value: `item-${index + 1}`, label: `Menu item ${index + 1}` }),
);

/** Share one DOM node between Menu.Content and ScrollArea.Viewport. */
function MenuArea(): JSX.Element {
  const contentId = createUniqueId();

  return (
    <>
      <div style={{ padding: '4rem' }}>
        <Menu.Root ids={{ content: contentId }}>
          <Menu.Trigger>Open scrollable menu</Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <ScrollArea.Root
                ids={{ viewport: contentId }}
                style={{ width: '15rem', height: '12rem', overflow: 'visible' }}
                variant="always"
              >
                <ScrollArea.Viewport
                  asChild={
                    /** Apply scrolling to the menu's accessible content node. */
                    (getProps) => (
                      <Menu.Content
                        {...getProps({ role: 'menu' })}
                        data-testid="scroll-menu-content"
                      >
                        <ScrollArea.Content>
                          <For each={menuItems}>
                            {/** Preserve the menu collection's document order. */}
                            {(item) => <Menu.Item value={item.value}>{item.label}</Menu.Item>}
                          </For>
                        </ScrollArea.Content>
                      </Menu.Content>
                    )
                  }
                />
                <ScrollArea.Scrollbar />
              </ScrollArea.Root>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Scroll Area Menu',
  component: MenuArea,
} satisfies Meta<typeof MenuArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Composition: Story = { render: MenuArea };
