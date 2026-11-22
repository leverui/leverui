import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '../src';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogPropsProvider,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  type DialogOpenChangeDetails,
} from '../src';

/** Exercise controlled state, portal composition, nested context, and focus. */
function DialogContractExample(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [large, setLarge] = createSignal(false);
  const [changes, setChanges] = createSignal(0);

  /** Write a primitive open change into the consumer's Solid signal. */
  function updateOpen(details: DialogOpenChangeDetails): void {
    setOpen(details.open);
    setChanges(changes() + 1);
  }

  /** Change the inherited Dialog CSS appearance without remounting the open content. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Select the first input as the controlled Dialog's initial focus target. */
  function initialFocus(): HTMLElement | null {
    return document.querySelector('[data-testid="dialog-first-input"]');
  }

  /** Record the actual native content element delivered to a consumer ref. */
  function markContent(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Record the native description element delivered to the consumer ref. */
  function markDescription(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  return (
    <>
      <div data-testid="dialog-contract">
        <DialogPropsProvider value={{ size: large() ? 'lg' : 'sm', placement: 'center' }}>
          <DialogRoot open={open()} onOpenChange={updateOpen} initialFocusEl={initialFocus}>
            <DialogTrigger data-testid="dialog-trigger">Open controlled dialog</DialogTrigger>
            <Portal>
              <DialogBackdrop data-testid="dialog-backdrop" />
              <DialogPositioner data-testid="dialog-positioner">
                <DialogContent ref={markContent} data-testid="dialog-content">
                  <DialogTitle>Controlled dialog</DialogTitle>
                  <DialogDescription ref={markDescription}>
                    Dialog focus and portal proof
                  </DialogDescription>
                  <input data-testid="dialog-first-input" aria-label="First dialog input" />
                  <button type="button" data-testid="dialog-size-toggle" onClick={toggleSize}>
                    Toggle Dialog size
                  </button>
                  <DialogRoot>
                    <DialogTrigger data-testid="nested-trigger">Open nested dialog</DialogTrigger>
                    <Portal>
                      <DialogBackdrop data-testid="nested-backdrop" />
                      <DialogPositioner>
                        <DialogContent data-testid="nested-content">
                          <DialogTitle>Nested dialog</DialogTitle>
                          <DialogDescription>Nearest Dialog context</DialogDescription>
                          <DialogCloseTrigger data-testid="nested-close">
                            Close nested
                          </DialogCloseTrigger>
                        </DialogContent>
                      </DialogPositioner>
                    </Portal>
                  </DialogRoot>
                  <DialogCloseTrigger data-testid="dialog-close">
                    Close controlled
                  </DialogCloseTrigger>
                </DialogContent>
              </DialogPositioner>
            </Portal>
          </DialogRoot>
          <DialogRoot>
            <DialogTrigger data-testid="uncontrolled-trigger">Open default dialog</DialogTrigger>
            <Portal>
              <DialogBackdrop />
              <DialogPositioner>
                <DialogContent data-testid="uncontrolled-content">
                  <DialogTitle>Default dialog</DialogTitle>
                  <DialogCloseTrigger data-testid="uncontrolled-close">
                    Close default
                  </DialogCloseTrigger>
                </DialogContent>
              </DialogPositioner>
            </Portal>
          </DialogRoot>
        </DialogPropsProvider>
        <output data-testid="dialog-open-state">{String(open())}</output>
        <output data-testid="dialog-changes">{changes()}</output>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Dialog',
  component: DialogContractExample,
} satisfies Meta<typeof DialogContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
