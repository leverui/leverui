import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  GripHorizontalIcon,
  XIcon,
} from '@lucide/solid';
import { Button, FloatingPanel, Grid, HStack, IconButton, Portal, Text } from '../../src';

/** Keep x/y coordinates in caller-owned Solid state. */
export function FloatingPanelPosition(): JSX.Element {
  const [position, setPosition] = createSignal({ x: 16, y: 100 });

  /** Apply a 50-pixel keyboard-pad movement in either axis. */
  function move(dx: number, dy: number): void {
    setPosition({ x: position().x + dx, y: position().y + dy });
  }

  return (
    <FloatingPanel.Root
      position={position()}
      onPositionChange={
        /** Synchronize drag movement from the panel machine. */
        (details) => setPosition(details.position)
      }
    >
      <HStack align="start" style={{ padding: 'var(--lui-spacing-3)' }}>
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
        <Grid templateColumns="repeat(3, 1fr)" style={{ gap: 'var(--lui-spacing-1)' }}>
          <span />
          <IconButton
            size="xs"
            variant="outline"
            aria-label="Move up"
            onClick={
              /** Move the panel one step up. */
              () => move(0, -50)
            }
          >
            <ArrowUpIcon />
          </IconButton>
          <span />
          <IconButton
            size="xs"
            variant="outline"
            aria-label="Move left"
            onClick={
              /** Move the panel one step left. */
              () => move(-50, 0)
            }
          >
            <ArrowLeftIcon />
          </IconButton>
          <span />
          <IconButton
            size="xs"
            variant="outline"
            aria-label="Move right"
            onClick={
              /** Move the panel one step right. */
              () => move(50, 0)
            }
          >
            <ArrowRightIcon />
          </IconButton>
          <span />
          <IconButton
            size="xs"
            variant="outline"
            aria-label="Move down"
            onClick={
              /** Move the panel one step down. */
              () => move(0, 50)
            }
          >
            <ArrowDownIcon />
          </IconButton>
          <span />
        </Grid>
        <Text
          textStyle="xs"
          style={{
            'font-family': 'var(--lui-fonts-mono)',
            color: 'var(--lui-colors-fg-muted)',
            'padding-top': 'var(--lui-spacing-1)',
          }}
        >
          x: {Math.round(position().x)}, y: {Math.round(position().y)}
        </Text>
      </HStack>
      <Portal>
        <FloatingPanel.Positioner>
          <FloatingPanel.Content>
            <FloatingPanel.Header>
              <FloatingPanel.DragTrigger>
                <GripHorizontalIcon />
                <FloatingPanel.Title>Controlled position</FloatingPanel.Title>
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
                Use the arrow pad above or drag the header to move this panel.
              </Text>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}
