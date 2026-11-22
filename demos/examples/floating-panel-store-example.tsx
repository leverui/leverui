import { type JSX } from '@solidjs/web';
import { GripHorizontalIcon, XIcon } from '@lucide/solid';
import { Button, FloatingPanel, IconButton, Portal } from '../../src';

/** Own the panel machine outside the rendered root. */
export function FloatingPanelStore(): JSX.Element {
  const panel = FloatingPanel.useFloatingPanel({
    defaultSize: { width: 320, height: 200 },
    minSize: { width: 280, height: 160 },
  });

  return (
    <FloatingPanel.RootProvider value={panel}>
      <FloatingPanel.Trigger
        asChild={
          /** Show the current machine state on its opening control. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              {panel().open ? 'Close panel' : 'Open panel'}
            </Button>
          )
        }
      />
      <Portal>
        <FloatingPanel.Positioner>
          <FloatingPanel.Content>
            <FloatingPanel.Header>
              <FloatingPanel.DragTrigger>
                <GripHorizontalIcon />
                <FloatingPanel.Title>Store</FloatingPanel.Title>
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
              Use <code>useFloatingPanel</code> with <code>FloatingPanel.RootProvider</code> to
              access panel state and methods from outside the panel tree.
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.RootProvider>
  );
}
