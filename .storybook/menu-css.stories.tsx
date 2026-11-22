import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Menu, Portal } from '../src';

/** Exercise responsive menu appearance through a portal and native props. */
function MenuCssExample(): JSX.Element {
  return (
    <>
      <Menu.Root
        defaultOpen
        size={{ base: 'sm', md: 'md' }}
        variant={{ base: 'subtle', md: 'solid' }}
      >
        <Menu.Trigger>Open CSS menu</Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content
              class="consumer-menu"
              style={{ 'min-height': '123px' }}
              data-testid="menu-css-content"
            >
              <Menu.Item value="first" data-testid="menu-css-item">
                First action
              </Menu.Item>
              <Menu.Item value="bare" unstyled data-testid="menu-css-bare-item">
                Bare action
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  );
}

/** Keep the primitive semantics when the root omits authored presentation. */
function MenuBareExample(): JSX.Element {
  return (
    <>
      <Menu.Root defaultOpen unstyled>
        <Menu.Trigger>Open bare menu</Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content data-testid="menu-css-bare-content">
              <Menu.Item value="bare">Bare action</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  );
}

const meta = {
  title: 'Internal/Menu CSS',
  component: MenuCssExample,
} satisfies Meta<typeof MenuCssExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
export const Bare: Story = { render: MenuBareExample };
