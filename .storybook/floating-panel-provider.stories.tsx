import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  FloatingPanel,
  FloatingPanelBody,
  FloatingPanelCloseTrigger,
  FloatingPanelContent,
  FloatingPanelDragTrigger,
  FloatingPanelHeader,
  FloatingPanelPositioner,
  FloatingPanelRootProvider,
  FloatingPanelTitle,
  Portal,
  type FloatingPanelOpenChangeDetails,
  type FloatingPanelPositionChangeDetails,
  type FloatingPanelSizeChangeDetails,
  useFloatingPanel,
} from '../src';

/** Exercise caller-owned open, position, size, and native composition. */
function FloatingPanelProviderExample(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [position, setPosition] = createSignal({ x: 80, y: 90 });
  const [size, setSize] = createSignal({ width: 320, height: 220 });

  /** Follow state changes emitted by the caller-owned primitive machine. */
  function updateOpen(details: FloatingPanelOpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Keep external position control synchronized with the primitive. */
  function updatePosition(details: FloatingPanelPositionChangeDetails): void {
    setPosition(details.position);
  }

  /** Keep external size control synchronized with the primitive. */
  function updateSize(details: FloatingPanelSizeChangeDetails): void {
    setSize(details.size);
  }

  /** Open through the external machine without using its trigger. */
  function openExternally(): void {
    setOpen(true);
  }

  /** Move the controlled panel without remounting its parts. */
  function moveExternally(): void {
    setPosition(
      /** Advance the controlled position by one visible step. */
      (current) => ({ x: current.x + 40, y: current.y + 20 }),
    );
  }

  /** Resize the controlled panel without remounting its parts. */
  function growExternally(): void {
    setSize(
      /** Increase both controlled dimensions for a live update. */
      (current) => ({ width: current.width + 40, height: current.height + 20 }),
    );
  }

  /** Capture the consumer-selected native title element. */
  function captureTitle(element: Element): void {
    if (element instanceof HTMLElement) {
      element.dataset.titleRef = 'attached';
    }
  }

  const panel = useFloatingPanel(
    /** Keep the external machine synchronized with the three owner signals. */
    () => ({
      open: open(),
      onOpenChange: updateOpen,
      position: position(),
      onPositionChange: updatePosition,
      size: size(),
      onSizeChange: updateSize,
      closeOnEscape: true,
    }),
  );

  return (
    <>
      <FloatingPanelRootProvider value={panel} lazyMount unmountOnExit>
        <FloatingPanel.Trigger
          asChild={
            /** Preserve a caller-owned native trigger and the primitive attributes. */
            (getProps) => (
              <button {...getProps()} data-testid="floating-provider-trigger">
                Open provider panel
              </button>
            )
          }
        />
        <Portal>
          <FloatingPanelPositioner data-testid="floating-provider-positioner">
            <FloatingPanelContent data-testid="floating-provider-content">
              <FloatingPanelHeader>
                <FloatingPanelDragTrigger>
                  <FloatingPanelTitle
                    as="h3"
                    ref={captureTitle}
                    data-testid="floating-provider-title"
                  >
                    Provider panel
                  </FloatingPanelTitle>
                </FloatingPanelDragTrigger>
                <FloatingPanelCloseTrigger data-testid="floating-provider-close">
                  Close provider panel
                </FloatingPanelCloseTrigger>
              </FloatingPanelHeader>
              <FloatingPanelBody>Caller-owned position and size</FloatingPanelBody>
            </FloatingPanelContent>
          </FloatingPanelPositioner>
        </Portal>
      </FloatingPanelRootProvider>
      <button type="button" data-testid="floating-external-open" onClick={openExternally}>
        Open externally
      </button>
      <button type="button" data-testid="floating-external-move" onClick={moveExternally}>
        Move externally
      </button>
      <button type="button" data-testid="floating-external-grow" onClick={growExternally}>
        Grow externally
      </button>
      <output data-testid="floating-provider-open">{String(open())}</output>
      <output data-testid="floating-provider-position">{`${position().x},${position().y}`}</output>
      <output data-testid="floating-provider-size">{`${size().width}×${size().height}`}</output>
    </>
  );
}

const meta = {
  title: 'Components/Floating Panel Provider',
  component: FloatingPanelProviderExample,
} satisfies Meta<typeof FloatingPanelProviderExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
