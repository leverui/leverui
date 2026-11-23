import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import { ChevronDownIcon } from '@lucide/solid';
import { Breadcrumb, Menu } from '../../src';

const menuItems = [
  { label: 'Components', value: 'components' },
  { label: 'Props', value: 'props' },
  { label: 'Customization', value: 'customization' },
] as const;

/** Let the middle breadcrumb open the three-item menu. */
export function BreadcrumbWithMenu(): JSX.Element {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List style={{ gap: 'var(--lui-spacing-4)' }}>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator>/</Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Menu.Root>
            <Menu.Trigger
              asChild={(getProps) => (
                <Breadcrumb.Link {...getProps({})} as="button">
                  Components
                  <ChevronDownIcon />
                </Breadcrumb.Link>
              )}
            />
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <For each={menuItems}>
                    {
                      /** Render one menu destination. */
                      (item) => <Menu.Item value={item.value}>{item.label}</Menu.Item>
                    }
                  </For>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Breadcrumb.Item>
        <Breadcrumb.Separator>/</Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink>Props</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
