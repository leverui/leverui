import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  FloatingPanelBody,
  FloatingPanelCloseTrigger,
  FloatingPanelContent,
  FloatingPanelControl,
  FloatingPanelDragTrigger,
  FloatingPanelHeader,
  FloatingPanelPositioner,
  FloatingPanelResizeTriggers,
  FloatingPanelRoot,
  FloatingPanelStageTrigger,
  FloatingPanelTitle,
  FloatingPanelTrigger,
  Portal,
  type FloatingPanelOpenChangeDetails,
  useFloatingPanelContext,
} from '../src';

/** Show the live size and position exposed by the primitive's machine. */
function PanelState(): JSX.Element {
  const panel = useFloatingPanelContext();
  return (
    <>
      <output data-testid="floating-size">{`${panel().size.width}×${panel().size.height}`}</output>
      <output data-testid="floating-position">
        {`${panel().position.x},${panel().position.y}`}
      </output>
    </>
  );
}

/** Exercise the public part family, stage controls, and resize handles. */
function FloatingPanelExample(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  /** Track the primitive's current open state after a trigger or close action. */
  function updateOpen(details: FloatingPanelOpenChangeDetails): void {
    setOpen(details.open);
  }

  return (
    <>
      <FloatingPanelRoot defaultSize={{ width: 320, height: 220 }} onOpenChange={updateOpen}>
        <FloatingPanelTrigger data-testid="floating-trigger">
          Open floating panel
        </FloatingPanelTrigger>
        <Portal>
          <FloatingPanelPositioner data-testid="floating-positioner">
            <FloatingPanelContent data-testid="floating-content">
              <FloatingPanelHeader data-testid="floating-header">
                <FloatingPanelDragTrigger data-testid="floating-drag">
                  <FloatingPanelTitle>Floating panel</FloatingPanelTitle>
                </FloatingPanelDragTrigger>
                <FloatingPanelControl>
                  <FloatingPanelStageTrigger stage="minimized" data-testid="floating-minimize">
                    Minimize
                  </FloatingPanelStageTrigger>
                  <FloatingPanelStageTrigger stage="maximized" data-testid="floating-maximize">
                    Maximize
                  </FloatingPanelStageTrigger>
                  <FloatingPanelStageTrigger stage="default" data-testid="floating-restore">
                    Restore
                  </FloatingPanelStageTrigger>
                  <FloatingPanelCloseTrigger data-testid="floating-close">
                    Close
                  </FloatingPanelCloseTrigger>
                </FloatingPanelControl>
              </FloatingPanelHeader>
              <FloatingPanelBody data-testid="floating-body">
                <p>Move or resize this panel.</p>
                <PanelState />
              </FloatingPanelBody>
              <FloatingPanelResizeTriggers axes={['s', 'e', 'se']} data-testid="floating-resize" />
            </FloatingPanelContent>
          </FloatingPanelPositioner>
        </Portal>
      </FloatingPanelRoot>
      <output data-testid="floating-open">{String(open())}</output>
    </>
  );
}

const meta = {
  title: 'Components/Floating Panel',
  component: FloatingPanelExample,
} satisfies Meta<typeof FloatingPanelExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
