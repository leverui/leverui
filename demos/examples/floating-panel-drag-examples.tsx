import { type JSX } from '@solidjs/web';
import { GripHorizontalIcon, XIcon } from '@lucide/solid';
import { Button, FloatingPanel, IconButton, Portal, Text } from '../../src';

/** Disable dragging while leaving resize handles active. */
export function FloatingPanelDisableDrag(): JSX.Element {
  return (
    <FloatingPanel.Root
      draggable={false}
      persistRect
      defaultSize={{ width: 320, height: 200 }}
      minSize={{ width: 320, height: 200 }}
    >
      <FloatingPanel.Trigger
        asChild={
          /** Apply machine attributes to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open panel
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
                <FloatingPanel.Title>Disable drag</FloatingPanel.Title>
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
              <Text textStyle="sm">
                You cannot drag this panel, so it stays in place. You can still resize it.
              </Text>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}

/** Keep the moving panel within the browser viewport. */
export function FloatingPanelPreventOverflow(): JSX.Element {
  return (
    <FloatingPanel.Root
      allowOverflow={false}
      persistRect
      defaultSize={{ width: 300, height: 180 }}
      minSize={{ width: 300, height: 180 }}
    >
      <FloatingPanel.Trigger
        asChild={
          /** Apply machine attributes to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open panel
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
                <FloatingPanel.Title>Prevent overflow</FloatingPanel.Title>
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
              <Text textStyle="sm">You cannot drag this panel past the edges of the window.</Text>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}

/** Start the panel immediately below its opening button. */
export function FloatingPanelAnchorPosition(): JSX.Element {
  let lastPosition = { x: 0, y: 0 };

  return (
    <FloatingPanel.Root
      getAnchorPosition={
        /** Anchor to the trigger while preserving the last position if it is absent. */
        (details) => {
          const rect = details.triggerRect;
          if (rect) lastPosition = { x: rect.left, y: rect.bottom + 8 };
          return lastPosition;
        }
      }
      defaultSize={{ width: 300, height: 200 }}
      minSize={{ width: 280, height: 160 }}
    >
      <FloatingPanel.Trigger
        asChild={
          /** Apply machine attributes to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open panel
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
                <FloatingPanel.Title>Anchor position</FloatingPanel.Title>
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
              <Text textStyle="sm">
                This panel opens below the button. Drag the header to move it.
              </Text>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}
