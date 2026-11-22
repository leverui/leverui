import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Portal,
  type DialogRootProps,
} from '../src';

type DialogSize = NonNullable<DialogRootProps['size']>;
type DialogPlacement = NonNullable<DialogRootProps['placement']>;
type DialogScroll = NonNullable<DialogRootProps['scrollBehavior']>;
type DialogMotion = NonNullable<DialogRootProps['motionPreset']>;

/** Exercise appearance changes without replacing an open Dialog machine. */
function DialogVariantsExample(): JSX.Element {
  const [size, setSize] = createSignal<DialogSize>('md');
  const [placement, setPlacement] = createSignal<DialogPlacement>('top');
  const [scroll, setScroll] = createSignal<DialogScroll>('outside');
  const [motion, setMotion] = createSignal<DialogMotion>('scale');
  const [alert, setAlert] = createSignal(false);

  /** Expand the content into the viewport-cover variant. */
  function selectCover(): void {
    setSize('cover');
  }

  /** Expand the content into the full-screen variant. */
  function selectFull(): void {
    setSize('full');
  }

  /** Return to the medium width. */
  function selectMedium(): void {
    setSize('md');
  }

  /** Move the content to the bottom of the viewport. */
  function selectBottom(): void {
    setPlacement('bottom');
  }

  /** Move the content to the viewport center. */
  function selectCenter(): void {
    setPlacement('center');
  }

  /** Restrict scrolling to the body slot. */
  function selectInside(): void {
    setScroll('inside');
  }

  /** Restore scrolling on the positioner. */
  function selectOutside(): void {
    setScroll('outside');
  }

  /** Select one known content-motion preset from the native control. */
  function selectMotion(event: Event & { currentTarget: HTMLSelectElement }): void {
    const value = event.currentTarget.value;
    switch (value) {
      case 'scale':
      case 'slide-in-bottom':
      case 'slide-in-top':
      case 'slide-in-left':
      case 'slide-in-right':
      case 'none':
        setMotion(value);
        return;
      default:
        throw new Error(`Unknown Dialog motion preset: ${value}`);
    }
  }

  /** Expose the primitive's alert-dialog role on the mounted content. */
  function selectAlert(): void {
    setAlert(true);
  }

  return (
    <>
      <DialogRoot
        defaultOpen
        size={size()}
        placement={placement()}
        scrollBehavior={scroll()}
        motionPreset={motion()}
        role={alert() ? 'alertdialog' : 'dialog'}
      >
        <DialogTrigger data-testid="dialog-variant-trigger">Open variants</DialogTrigger>
        <Portal>
          <DialogPositioner data-testid="dialog-variant-positioner">
            <DialogContent data-testid="dialog-variant-content">
              <DialogHeader>
                <DialogTitle>Dialog variants</DialogTitle>
              </DialogHeader>
              <DialogBody data-testid="dialog-variant-body">
                <button type="button" onClick={selectCover}>
                  Cover
                </button>
                <button type="button" onClick={selectFull}>
                  Full
                </button>
                <button type="button" onClick={selectMedium}>
                  Medium
                </button>
                <button type="button" onClick={selectBottom}>
                  Bottom
                </button>
                <button type="button" onClick={selectCenter}>
                  Center
                </button>
                <button type="button" onClick={selectInside}>
                  Inside
                </button>
                <button type="button" onClick={selectOutside}>
                  Outside
                </button>
                <select aria-label="Motion preset" onChange={selectMotion}>
                  <option value="scale">Scale</option>
                  <option value="slide-in-bottom">Slide from bottom</option>
                  <option value="slide-in-top">Slide from top</option>
                  <option value="slide-in-left">Slide from left</option>
                  <option value="slide-in-right">Slide from right</option>
                  <option value="none">No motion</option>
                </select>
                <button type="button" onClick={selectAlert}>
                  Alert role
                </button>
              </DialogBody>
              <DialogCloseTrigger>Close variants</DialogCloseTrigger>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>
    </>
  );
}

/** Keep the full-to-large responsive size on one Dialog instance. */
function DialogResponsiveExample(): JSX.Element {
  return (
    <>
      <DialogRoot defaultOpen size={{ mdDown: 'full', md: 'lg' }}>
        <DialogTrigger>Open responsive Dialog</DialogTrigger>
        <Portal>
          <DialogPositioner>
            <DialogContent data-testid="dialog-responsive-content">
              <DialogHeader>
                <DialogTitle>Responsive Dialog</DialogTitle>
              </DialogHeader>
              <DialogBody>Resize the viewport to change the size.</DialogBody>
              <DialogCloseTrigger>Close responsive Dialog</DialogCloseTrigger>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>
    </>
  );
}

const meta = {
  title: 'Components/Dialog Variants',
  component: DialogVariantsExample,
} satisfies Meta<typeof DialogVariantsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};

export const Responsive: Story = { render: DialogResponsiveExample };
