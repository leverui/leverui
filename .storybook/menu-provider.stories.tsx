import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuPropsProvider,
  MenuRoot,
  MenuRootProvider,
  MenuTrigger,
  Portal,
  type MenuOpenChangeDetails,
  useMenu,
} from '../src';

/** Exercise external machine ownership and reactive appearance defaults. */
function ControlledMenu(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [size, setSize] = createSignal<'sm' | 'md'>('md');

  /** Synchronize the primitive's requested open state with caller-owned state. */
  function updateOpen(details: MenuOpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Toggle controlled open state without replacing the primitive machine. */
  function toggleOpen(): void {
    setOpen(!open());
  }

  /** Change the inherited authored size while the menu remains mounted. */
  function toggleSize(): void {
    setSize(
      /** Alternate the current size without replacing either menu root. */
      (current) => (current === 'md' ? 'sm' : 'md'),
    );
  }

  const menu = useMenu(
    /** Track the caller's controlled state in the primitive's machine. */
    () => ({ open: open(), onOpenChange: updateOpen }),
  );
  const lazyMenu = useMenu({ defaultOpen: false });

  return (
    <>
      <button type="button" data-testid="menu-open-toggle" onClick={toggleOpen}>
        Toggle open
      </button>
      <button type="button" data-testid="menu-size-toggle" onClick={toggleSize}>
        Toggle size
      </button>
      <MenuPropsProvider
        value={
          /** Keep defaults reactive across both menu roots. */
          () => ({ size: size() })
        }
      >
        <MenuRootProvider value={menu}>
          <MenuTrigger data-testid="menu-provider-trigger">Controlled menu</MenuTrigger>
          <Portal>
            <MenuPositioner>
              <MenuContent data-testid="menu-provider-content">
                <MenuItem value="edit">Edit</MenuItem>
              </MenuContent>
            </MenuPositioner>
          </Portal>
        </MenuRootProvider>
        <MenuRootProvider value={lazyMenu} lazyMount>
          <MenuTrigger data-testid="menu-lazy-trigger">Lazy menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent data-testid="menu-lazy-content">
              <MenuItem value="lazy">Lazy item</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </MenuRootProvider>
        <MenuRoot size="sm" lazyMount={false} unmountOnExit={false}>
          <MenuTrigger>Fixed size menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent data-testid="menu-fixed-content">
              <MenuItem value="fixed">Fixed</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </MenuRoot>
      </MenuPropsProvider>
      <output data-testid="menu-controlled-open">{String(open())}</output>
    </>
  );
}

const meta = {
  title: 'Components/Menu Provider',
  component: ControlledMenu,
} satisfies Meta<typeof ControlledMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
