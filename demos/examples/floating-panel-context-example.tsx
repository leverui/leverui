import { type JSX } from '@solidjs/web';
import { GripHorizontalIcon, XIcon } from '@lucide/solid';
import { Button, FloatingPanel, HStack, IconButton, Portal, Text } from '../../src';

/** Control the panel stages through its own context methods. */
function PanelActions(): JSX.Element {
  const panel = FloatingPanel.useFloatingPanelContext();
  return (
    <HStack gap="2">
      <Button
        size="sm"
        variant="outline"
        onClick={
          /** Minimize the current context panel. */
          () => panel().minimize()
        }
      >
        Minimize
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={
          /** Maximize the current context panel. */
          () => panel().maximize()
        }
      >
        Maximize
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={
          /** Restore the current context panel. */
          () => panel().restore()
        }
      >
        Restore
      </Button>
    </HStack>
  );
}

/** Show context actions from within the panel body. */
export function FloatingPanelContext(): JSX.Element {
  return (
    <FloatingPanel.Root
      defaultSize={{ width: 320, height: 200 }}
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
                <FloatingPanel.Title>Context</FloatingPanel.Title>
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
              <Text
                textStyle="sm"
                style={{
                  'margin-bottom': 'var(--leverui-spacing-3)',
                }}
              >
                Control the panel from inside the body using <code>useFloatingPanelContext</code>.
              </Text>
              <PanelActions />
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}
