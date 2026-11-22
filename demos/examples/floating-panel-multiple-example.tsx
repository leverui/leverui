import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { GripHorizontalIcon, XIcon } from '@lucide/solid';
import { Button, FloatingPanel, HStack, IconButton, Portal, Text } from '../../src';

const panels = [
  {
    id: 'notes',
    title: 'Notes',
    defaultPosition: { x: 80, y: 80 },
    description: 'Jot down quick ideas and reminders.',
  },
  {
    id: 'tasks',
    title: 'Tasks',
    defaultPosition: { x: 260, y: 120 },
    description: 'Track items you want to finish today.',
  },
  {
    id: 'chat',
    title: 'Chat',
    defaultPosition: { x: 440, y: 160 },
    description: 'Keep a conversation open while you work.',
  },
] as const;

/** Let three independently positioned panels remain open together. */
export function FloatingPanelMultiple(): JSX.Element {
  return (
    <HStack gap="2" style={{ 'flex-wrap': 'wrap' }}>
      <For each={panels}>
        {
          /** Give each panel its own machine and starting position. */
          (panel) => (
            <FloatingPanel.Root
              id={panel.id}
              persistRect
              defaultPosition={panel.defaultPosition}
              defaultSize={{ width: 280, height: 200 }}
              minSize={{ width: 240, height: 160 }}
            >
              <FloatingPanel.Trigger
                asChild={
                  /** Apply machine attributes to the outline button. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline" size="sm">
                      {panel.title}
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
                        <FloatingPanel.Title>{panel.title}</FloatingPanel.Title>
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
                      <Text textStyle="sm">{panel.description}</Text>
                    </FloatingPanel.Body>
                    <FloatingPanel.ResizeTriggers />
                  </FloatingPanel.Content>
                </FloatingPanel.Positioner>
              </Portal>
            </FloatingPanel.Root>
          )
        }
      </For>
    </HStack>
  );
}
