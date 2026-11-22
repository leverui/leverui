import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Portal,
} from '../src';

/** Exercise Dialog focus, dismissal, and nonmodal machine options. */
function DialogMachineOptionsExample(): JSX.Element {
  const [dismissOutside, setDismissOutside] = createSignal(false);
  const [outsideClicks, setOutsideClicks] = createSignal(0);
  let finalTarget: HTMLButtonElement | undefined;

  /** Keep the external focus destination for the modal Dialog. */
  function captureFinalTarget(element: HTMLButtonElement): void {
    finalTarget = element;
  }

  /** Return the mounted element to the primitive when the modal Dialog closes. */
  function getFinalFocus(): HTMLButtonElement {
    if (!finalTarget) throw new Error('Dialog final focus target is missing.');
    return finalTarget;
  }

  /** Permit a subsequent pointer interaction to dismiss the modal Dialog. */
  function allowOutsideDismissal(): void {
    setDismissOutside(true);
  }

  /** Count interactions with the page while its nonmodal Dialog is open. */
  function recordOutsideClick(): void {
    setOutsideClicks(outsideClicks() + 1);
  }

  return (
    <>
      <DialogRoot closeOnInteractOutside={dismissOutside()} finalFocusEl={getFinalFocus}>
        <DialogTrigger data-testid="dialog-options-first-trigger">Open first</DialogTrigger>
        <DialogTrigger data-testid="dialog-options-second-trigger">Open second</DialogTrigger>
        <Portal>
          <DialogBackdrop data-testid="dialog-options-backdrop" />
          <DialogPositioner>
            <DialogContent data-testid="dialog-options-modal-content">
              <DialogTitle>Modal options</DialogTitle>
              <DialogBody>
                <button type="button" onClick={allowOutsideDismissal}>
                  Allow outside close
                </button>
              </DialogBody>
              <DialogCloseTrigger>Close modal options</DialogCloseTrigger>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>

      <button type="button" ref={captureFinalTarget} data-testid="dialog-final-focus">
        Final focus target
      </button>

      <DialogRoot modal={false} closeOnInteractOutside={false}>
        <DialogTrigger data-testid="dialog-nonmodal-trigger">Open nonmodal</DialogTrigger>
        <Portal>
          <DialogPositioner style={{ 'pointer-events': 'none' }}>
            <DialogContent
              style={{ 'pointer-events': 'auto' }}
              data-testid="dialog-nonmodal-content"
            >
              <DialogTitle>Nonmodal options</DialogTitle>
              <DialogCloseTrigger>Close nonmodal</DialogCloseTrigger>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>

      <button type="button" data-testid="dialog-outside-action" onClick={recordOutsideClick}>
        Outside action
      </button>
      <output data-testid="dialog-outside-count">{outsideClicks()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Dialog Machine Options',
  component: DialogMachineOptionsExample,
} satisfies Meta<typeof DialogMachineOptionsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
