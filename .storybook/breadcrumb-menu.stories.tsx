import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Breadcrumb, Menu, Portal } from '../src';

/** Compose the Breadcrumb link as a native menu trigger button. */
function BreadcrumbMenuExample(): JSX.Element {
  /** Mark the node delivered to the menu trigger's ref. */
  function captureMenuRef(element: Element): void {
    element.setAttribute('data-menu-ref', 'true');
  }

  /** Mark the same node delivered to the caller-owned link ref. */
  function captureLinkRef(element: Element): void {
    element.setAttribute('data-link-ref', 'true');
  }

  return (
    <>
      <div style={{ padding: '80px' }}>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#docs">Docs</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Menu.Root>
                <Menu.Trigger
                  ref={captureMenuRef}
                  asChild={
                    /** Put menu behavior on the styled native button. */
                    (getProps) => (
                      <Breadcrumb.Link
                        as="button"
                        type="button"
                        {...getProps({ ref: captureLinkRef })}
                        data-testid="breadcrumb-menu-trigger"
                      >
                        Components
                      </Breadcrumb.Link>
                    )
                  }
                />
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content data-testid="breadcrumb-menu-content">
                      <Menu.Item value="props">Props</Menu.Item>
                      <Menu.Item value="styles">Styles</Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink>Current</Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Breadcrumb/Menu',
  component: BreadcrumbMenuExample,
} satisfies Meta<typeof BreadcrumbMenuExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Composition: Story = {};
