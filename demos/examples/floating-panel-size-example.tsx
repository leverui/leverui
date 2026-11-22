import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { GripHorizontalIcon, XIcon } from '@lucide/solid';
import { Button, FloatingPanel, HStack, IconButton, Portal, Stack, Text } from '../../src';

/** Drive panel dimensions through three size choices. */
export function FloatingPanelSize(): JSX.Element {
  const [size, setSize] = createSignal({ width: 360, height: 260 });

  return (
    <FloatingPanel.Root
      size={size()}
      onSizeChange={
        /** Synchronize resize handle changes with the external signal. */
        (details) => setSize(details.size)
      }
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
                <FloatingPanel.Title>Controlled size</FloatingPanel.Title>
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
              <Stack gap="3">
                <HStack gap="2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={
                      /** Choose the small dimensions. */
                      () => setSize({ width: 240, height: 180 })
                    }
                  >
                    S
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={
                      /** Restore the medium dimensions. */
                      () => setSize({ width: 360, height: 260 })
                    }
                  >
                    M
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={
                      /** Choose the large dimensions. */
                      () => setSize({ width: 520, height: 360 })
                    }
                  >
                    L
                  </Button>
                </HStack>
                <Text
                  textStyle="sm"
                  style={{
                    color: 'var(--leverui-colors-fg-muted)',
                  }}
                >
                  {Number(size().width.toFixed(2))} x {Number(size().height.toFixed(2))}px
                </Text>
              </Stack>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}
