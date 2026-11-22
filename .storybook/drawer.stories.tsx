import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerRootPropsProvider,
  DrawerTitle,
  DrawerTrigger,
  Portal,
  type DrawerOpenChangeDetails,
} from '../src';

/** Exercise controlled state, inherited CSS appearance values, nested focus, and action dismissal. */
function DrawerContractExample(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [wide, setWide] = createSignal(false);
  const [actionOpen, setActionOpen] = createSignal('not-called');
  let firstInput: HTMLInputElement | undefined;

  /** Keep the consumer's controlled state synchronized with the primitive. */
  function updateOpen(details: DrawerOpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Follow a changing provider size without replacing the open Drawer. */
  function readDefaults(): { size: 'sm' | 'lg'; placement: 'end' } {
    return { size: wide() ? 'lg' : 'sm', placement: 'end' };
  }

  /** Select the first field for the Drawer's initial focus. */
  function readInitialFocus(): HTMLInputElement | null {
    return firstInput ?? null;
  }

  /** Remember the actual input after Solid mounts it. */
  function captureInput(element: HTMLInputElement): void {
    firstInput = element;
  }

  /** Expand the inherited Drawer size while preserving its machine ID. */
  function expandDrawer(): void {
    setWide(true);
  }

  /** Record the open state before the action closes the Drawer. */
  function recordAction(): void {
    setActionOpen(String(open()));
  }

  /** Mark the semantic content element delivered to the caller ref. */
  function markContent(element: HTMLElement): void {
    element.dataset.drawerRefTag = element.tagName.toLowerCase();
  }

  return (
    <>
      <DrawerRootPropsProvider value={readDefaults}>
        <DrawerRoot open={open()} onOpenChange={updateOpen} initialFocusEl={readInitialFocus}>
          <DrawerTrigger data-testid="drawer-trigger">Open controlled Drawer</DrawerTrigger>
          <Portal>
            <DrawerBackdrop data-testid="drawer-backdrop" />
            <DrawerPositioner data-testid="drawer-positioner">
              <DrawerContent ref={markContent} data-testid="drawer-content">
                <DrawerHeader data-testid="drawer-header">
                  <DrawerTitle>Controlled Drawer</DrawerTitle>
                  <DrawerDescription>
                    the primitive Dialog behavior in a Drawer layout
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerBody data-testid="drawer-body">
                  <input ref={captureInput} aria-label="Drawer first field" />
                  <button type="button" onClick={expandDrawer}>
                    Expand Drawer
                  </button>
                  <DrawerRoot>
                    <DrawerTrigger data-testid="nested-drawer-trigger">
                      Open nested Drawer
                    </DrawerTrigger>
                    <Portal>
                      <DrawerBackdrop />
                      <DrawerPositioner>
                        <DrawerContent data-testid="nested-drawer-content">
                          <DrawerTitle>Nested Drawer</DrawerTitle>
                          <DrawerCloseTrigger data-testid="nested-drawer-close">
                            Close nested Drawer
                          </DrawerCloseTrigger>
                        </DrawerContent>
                      </DrawerPositioner>
                    </Portal>
                  </DrawerRoot>
                </DrawerBody>
                <DrawerFooter data-testid="drawer-footer">
                  <DrawerActionTrigger data-testid="drawer-action" onClick={recordAction}>
                    Save and close
                  </DrawerActionTrigger>
                </DrawerFooter>
                <DrawerCloseTrigger data-testid="drawer-close">Close Drawer</DrawerCloseTrigger>
              </DrawerContent>
            </DrawerPositioner>
          </Portal>
        </DrawerRoot>
      </DrawerRootPropsProvider>
      <output data-testid="drawer-open-state">{String(open())}</output>
      <output data-testid="drawer-action-open-state">{actionOpen()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Drawer',
  component: DrawerContractExample,
} satisfies Meta<typeof DrawerContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
