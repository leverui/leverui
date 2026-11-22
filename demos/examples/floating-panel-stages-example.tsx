import { type JSX } from '@solidjs/web';
import { GripHorizontalIcon, Maximize2Icon, MinusIcon, SquareIcon, XIcon } from '@lucide/solid';
import { Button, FloatingPanel, IconButton, Portal, Text } from '../../src';

/** Expose the minimized, maximized, and restored panel stages. */
export function FloatingPanelStages(): JSX.Element {
  return (
    <FloatingPanel.Root
      persistRect
      defaultSize={{ width: 320, height: 220 }}
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
                <FloatingPanel.Title>Stages</FloatingPanel.Title>
              </FloatingPanel.DragTrigger>
              <FloatingPanel.Control>
                <FloatingPanel.StageTrigger
                  stage="minimized"
                  asChild={
                    /** Pass stage trigger attributes to the icon control. */
                    (getProps) => (
                      <IconButton
                        {...getProps()}
                        variant="ghost"
                        size="2xs"
                        aria-label="minimized panel"
                      >
                        <MinusIcon />
                      </IconButton>
                    )
                  }
                />
                <FloatingPanel.StageTrigger
                  stage="maximized"
                  asChild={
                    /** Pass stage trigger attributes to the icon control. */
                    (getProps) => (
                      <IconButton
                        {...getProps()}
                        variant="ghost"
                        size="2xs"
                        aria-label="maximized panel"
                      >
                        <SquareIcon />
                      </IconButton>
                    )
                  }
                />
                <FloatingPanel.StageTrigger
                  stage="default"
                  asChild={
                    /** Pass stage trigger attributes to the icon control. */
                    (getProps) => (
                      <IconButton
                        {...getProps()}
                        variant="ghost"
                        size="2xs"
                        aria-label="default panel"
                      >
                        <Maximize2Icon />
                      </IconButton>
                    )
                  }
                />
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
                Use the header controls to minimize, maximize, or restore the panel.
              </Text>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}
