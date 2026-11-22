import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  DrawerActionTrigger,
  DrawerBody,
  DrawerContent,
  DrawerContext,
  DrawerHeader,
  DrawerPositioner,
  DrawerRootProvider,
  DrawerRootPropsProvider,
  DrawerTitle,
  DrawerTrigger,
  Portal,
  useDrawer,
} from '../src';

/** Exercise an external primitive Dialog accessor through the public Drawer names. */
function DrawerProviderContent(): JSX.Element {
  const drawer = useDrawer();
  const [large, setLarge] = createSignal(false);
  const [boundAction, setBoundAction] = createSignal('not-called');

  /** Change only the inherited Drawer CSS size. */
  function readDefaults(): { size: 'xs' | 'lg'; placement: 'start' } {
    return { size: large() ? 'lg' : 'xs', placement: 'start' };
  }

  /** Open the externally owned machine without using its trigger. */
  function openExternal(): void {
    drawer().setOpen(true);
  }

  /** Expand the CSS appearance without remounting the external machine. */
  function expand(): void {
    setLarge(true);
  }

  /** Record bound Solid click data and the machine state before dismissal. */
  function recordBoundAction(
    data: string,
    event: MouseEvent & { currentTarget: HTMLButtonElement },
  ): void {
    setBoundAction(`${data}:${event.type}:${drawer().open}`);
  }

  /** Render a changing state value from the public Drawer context. */
  function renderContext(context: typeof drawer): JSX.Element {
    return <output data-testid="drawer-provider-state">{String(context().open)}</output>;
  }

  return (
    <div>
      <button type="button" data-testid="drawer-external-open" onClick={openExternal}>
        Open external Drawer
      </button>
      <DrawerRootPropsProvider value={readDefaults}>
        <DrawerRootProvider value={drawer} lazyMount unmountOnExit>
          <DrawerTrigger data-testid="drawer-provider-trigger">Open provider Drawer</DrawerTrigger>
          <DrawerContext>{renderContext}</DrawerContext>
          <Portal>
            <DrawerPositioner data-testid="drawer-provider-positioner">
              <DrawerContent data-testid="drawer-provider-content">
                <DrawerHeader>
                  <DrawerTitle>Provider Drawer</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                  <input aria-label="Provider Drawer field" />
                  <button type="button" onClick={expand}>
                    Expand provider Drawer
                  </button>
                </DrawerBody>
                <DrawerActionTrigger
                  data-testid="drawer-provider-action"
                  onClick={[recordBoundAction, 'saved']}
                >
                  Save and close
                </DrawerActionTrigger>
              </DrawerContent>
            </DrawerPositioner>
          </Portal>
        </DrawerRootProvider>
      </DrawerRootPropsProvider>
      <output data-testid="drawer-provider-bound-action">{boundAction()}</output>
    </div>
  );
}

/** Supply the CSS theme before creating the external machine. */
function DrawerProviderExample(): JSX.Element {
  return (
    <>
      <DrawerProviderContent />
    </>
  );
}

const meta = {
  title: 'Components/Drawer Provider',
  component: DrawerProviderExample,
} satisfies Meta<typeof DrawerProviderExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
