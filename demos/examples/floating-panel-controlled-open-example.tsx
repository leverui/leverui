import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { GripHorizontalIcon, XIcon } from '@lucide/solid';
import { Button, FloatingPanel, HStack, IconButton, Portal } from '../../src';

/** Keep opening and closing state under the example's control. */
export function FloatingPanelControlledOpen(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  return (
    <FloatingPanel.Root
      open={open()}
      onOpenChange={
        /** Mirror trigger and close actions in the external signal. */
        (details) => setOpen(details.open)
      }
      persistRect
      defaultSize={{ width: 320, height: 200 }}
      minSize={{ width: 320, height: 200 }}
    >
      <HStack>
        <FloatingPanel.Trigger
          asChild={
            /** Bind machine trigger behavior to the changing button label. */
            (getProps) => (
              <Button {...getProps()} variant="outline" size="sm">
                {open() ? 'Close panel' : 'Open panel'}
              </Button>
            )
          }
        />
      </HStack>
      <Portal>
        <FloatingPanel.Positioner>
          <FloatingPanel.Content>
            <FloatingPanel.Header>
              <FloatingPanel.DragTrigger>
                <GripHorizontalIcon />
                <FloatingPanel.Title>Controlled open</FloatingPanel.Title>
              </FloatingPanel.DragTrigger>
              <FloatingPanel.Control>
                <FloatingPanel.CloseTrigger
                  asChild={
                    /** Apply the machine close props to its icon action. */
                    (getProps) => (
                      <IconButton
                        {...getProps()}
                        variant="ghost"
                        size="2xs"
                        aria-label="Close panel"
                      >
                        <XIcon />
                      </IconButton>
                    )
                  }
                />
              </FloatingPanel.Control>
            </FloatingPanel.Header>
            <FloatingPanel.Body>
              The open state is controlled from outside the panel. The × button and the trigger both
              update the same state.
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}
