import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  Portal,
} from '../src';

/** Exercise custom portal containment and nonmodal page interaction. */
function DrawerOptionsExample(): JSX.Element {
  const [outsideClicks, setOutsideClicks] = createSignal(0);
  let customContainer: HTMLDivElement | undefined;
  let focusField: HTMLInputElement | undefined;
  let finalTarget: HTMLButtonElement | undefined;

  /** Capture the custom portal host after Solid mounts the native div. */
  function captureContainer(element: HTMLDivElement): void {
    customContainer = element;
  }

  /** Follow the mounted custom host when Portal moves its children. */
  function readContainer(): HTMLDivElement | undefined {
    return customContainer;
  }

  /** Capture the field requested as the first focused element. */
  function captureFocusField(element: HTMLInputElement): void {
    focusField = element;
  }

  /** Give the primitive the mounted initial focus field. */
  function readInitialFocus(): HTMLInputElement | null {
    return focusField ?? null;
  }

  /** Keep the external focus destination for the contained Drawer. */
  function captureFinalTarget(element: HTMLButtonElement): void {
    finalTarget = element;
  }

  /** Restore focus to a page control after the contained Drawer closes. */
  function readFinalFocus(): HTMLButtonElement | null {
    return finalTarget ?? null;
  }

  /** Count a page action while a nonmodal Drawer remains open. */
  function recordOutsideClick(): void {
    setOutsideClicks(outsideClicks() + 1);
  }

  return (
    <>
      <DrawerRoot
        closeOnInteractOutside={false}
        finalFocusEl={readFinalFocus}
        initialFocusEl={readInitialFocus}
      >
        <div
          ref={captureContainer}
          data-testid="drawer-custom-container"
          style={{ position: 'relative', overflow: 'hidden', height: '400px' }}
        >
          <DrawerTrigger data-testid="drawer-custom-trigger">Open contained Drawer</DrawerTrigger>
        </div>
        <Portal container={readContainer}>
          <span data-testid="drawer-generic-portal">Unrelated portal content</span>
        </Portal>
        <Portal container={readContainer}>
          <DrawerBackdrop style={{ position: 'absolute', width: '100%', height: '100%' }} />
          <DrawerPositioner
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            data-testid="drawer-custom-positioner"
          >
            <DrawerContent data-testid="drawer-custom-content">
              <DrawerTitle>Contained Drawer</DrawerTitle>
              <DrawerBody>
                <input ref={captureFocusField} aria-label="Contained Drawer field" />
              </DrawerBody>
              <DrawerCloseTrigger>Close contained Drawer</DrawerCloseTrigger>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </DrawerRoot>
      <button type="button" ref={captureFinalTarget} data-testid="drawer-final-focus">
        Final focus target
      </button>

      <DrawerRoot modal={false} closeOnInteractOutside={false}>
        <DrawerTrigger data-testid="drawer-nonmodal-trigger">Open nonmodal Drawer</DrawerTrigger>
        <Portal>
          <DrawerPositioner style={{ 'pointer-events': 'none' }}>
            <DrawerContent
              style={{ 'pointer-events': 'auto' }}
              data-testid="drawer-nonmodal-content"
            >
              <DrawerTitle>Nonmodal Drawer</DrawerTitle>
              <DrawerCloseTrigger>Close nonmodal Drawer</DrawerCloseTrigger>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </DrawerRoot>
      <button type="button" data-testid="drawer-outside-action" onClick={recordOutsideClick}>
        Outside action
      </button>
      <output data-testid="drawer-outside-count">{outsideClicks()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Drawer Options',
  component: DrawerOptionsExample,
} satisfies Meta<typeof DrawerOptionsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
