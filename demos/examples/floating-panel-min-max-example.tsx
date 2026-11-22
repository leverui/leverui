import { type JSX } from '@solidjs/web';
import { GripHorizontalIcon, XIcon } from '@lucide/solid';
import { Button, FloatingPanel, HStack, IconButton, Portal, Span, Stack, Text } from '../../src';

/** Clamp resizing between the minimum and maximum dimensions. */
export function FloatingPanelMinMax(): JSX.Element {
  return (
    <Stack gap="4" align="flex-start">
      <HStack gap="2" textStyle="sm">
        <Span>Drag the resize handles. The size stays between the min and the max.</Span>
      </HStack>
      <FloatingPanel.Root
        defaultSize={{ width: 320, height: 220 }}
        minSize={{ width: 280, height: 160 }}
        maxSize={{ width: 480, height: 320 }}
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
                  <FloatingPanel.Title>Min/Max</FloatingPanel.Title>
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
                  Resize the panel with the handles. It can be no smaller than 280x160px (min) and
                  no larger than 480x320px (max).
                </Text>
              </FloatingPanel.Body>
              <FloatingPanel.ResizeTriggers />
            </FloatingPanel.Content>
          </FloatingPanel.Positioner>
        </Portal>
      </FloatingPanel.Root>
    </Stack>
  );
}
