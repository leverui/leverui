import { type JSX } from '@solidjs/web';
import { GripHorizontalIcon, XIcon } from '@lucide/solid';
import { Button, FloatingPanel, IconButton, Portal, Text } from '../../src';

/** Mirror the panel's controls and Arabic content in RTL mode. */
export function FloatingPanelRtl(): JSX.Element {
  return (
    <FloatingPanel.Root
      dir="rtl"
      persistRect
      defaultSize={{ width: 320, height: 200 }}
      minSize={{ width: 320, height: 200 }}
    >
      <FloatingPanel.Trigger
        asChild={
          /** Apply machine attributes to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              فتح اللوحة
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
                <FloatingPanel.Title>لوحة عائمة</FloatingPanel.Title>
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
              <Text textStyle="sm">هذه اللوحة تدعم اتجاه النص من اليمين إلى اليسار.</Text>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}
