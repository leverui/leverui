import { type JSX } from '@solidjs/web';
import { GripHorizontalIcon, XIcon } from '@lucide/solid';
import { Box, Button, FloatingPanel, IconButton, Portal, Text } from '../../src';

/** Keep panel drag movement within the dashed boundary. */
export function FloatingPanelBoundary(): JSX.Element {
  let boundary: HTMLDivElement | undefined;

  return (
    <Box
      ref={boundary}
      style={{
        position: 'relative',
        'border-width': '2px',
        'border-style': 'dashed',
        'border-color': 'var(--lui-colors-border-emphasized)',
        'border-radius': 'var(--lui-radii-l2)',
        width: '100%',
        height: '400px',
        padding: 'var(--lui-spacing-4)',
      }}
    >
      <Text
        textStyle="xs"
        style={{
          color: 'var(--lui-colors-fg-muted)',
          'margin-bottom': 'var(--lui-spacing-2)',
        }}
      >
        Drag boundary
      </Text>
      <FloatingPanel.Root
        persistRect
        allowOverflow={false}
        getBoundaryEl={
          /** Give the machine the current boundary element after mount. */
          () => boundary ?? null
        }
        defaultSize={{ width: 280, height: 180 }}
        minSize={{ width: 280, height: 180 }}
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
                  <FloatingPanel.Title>Bounded panel</FloatingPanel.Title>
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
                <Text textStyle="sm">You cannot drag this panel outside the dashed box.</Text>
              </FloatingPanel.Body>
              <FloatingPanel.ResizeTriggers />
            </FloatingPanel.Content>
          </FloatingPanel.Positioner>
        </Portal>
      </FloatingPanel.Root>
    </Box>
  );
}
