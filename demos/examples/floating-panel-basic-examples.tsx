import { type JSX } from '@solidjs/web';
import { GripHorizontalIcon, Maximize2Icon, MinusIcon, SquareIcon, XIcon } from '@lucide/solid';
import { Button, FloatingPanel, IconButton, Portal } from '../../src';

/** Show the movable, resizable panel. */
export function FloatingPanelBasic(): JSX.Element {
  return (
    <FloatingPanel.Root>
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
                <FloatingPanel.Title>Floating panel</FloatingPanel.Title>
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
              <p>Drag the header to move this panel around.</p>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}
