import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Button, CloseButton, Dialog, Group, Popover, Portal, Text } from '../../src';

/** Open a nested Popover from inside a modal Dialog. */
export function PopoverOpenFromDialog(): JSX.Element {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        asChild={
          /** Forward dialog activation to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline">
              Open dialog
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger
              asChild={
                /** Preserve modal dismissal on the styled close button. */
                (getProps) => <CloseButton {...getProps()} />
              }
            />
            <Dialog.Header>
              <Dialog.Title>Popover in a dialog</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Popover.Root>
                <Popover.Trigger
                  asChild={
                    /** Forward the trigger props to the styled button. */
                    (getProps) => (
                      <Button {...getProps()} size="sm" variant="outline">
                        Click me
                      </Button>
                    )
                  }
                />
                <Popover.Positioner>
                  <Popover.Content>
                    <Popover.Arrow />
                    <Popover.Body>
                      <Popover.Title style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>
                        Lanternwright Notes
                      </Popover.Title>
                      <Text style={{ 'margin-block': 'var(--lui-spacing-4)' }}>
                        The Lanternwright Chronicles is a fantasy novel series about an apprentice
                        lamplighter in a city that rearranges itself every night.
                      </Text>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            </Dialog.Body>
            <Dialog.Footer />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

/** Focus the first footer action when the Popover opens. */
export function PopoverInitialFocus(): JSX.Element {
  const [previous, setPrevious] = createSignal<HTMLButtonElement | null>(null);
  return (
    <Popover.Root initialFocusEl={previous}>
      <Popover.Trigger
        asChild={
          /** Forward the trigger props to the styled button. */
          (getProps) => (
            <Button {...getProps()} size="sm" variant="outline">
              Click me
            </Button>
          )
        }
      />
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Header>Manage your channels</Popover.Header>
            <Popover.Arrow />
            <Popover.Body>The Prev button gets focus when this popover opens.</Popover.Body>
            <Popover.Footer>
              <Box style={{ 'font-size': 'var(--lui-font-sizes-sm)', flex: '1' }}>Step 2 of 4</Box>
              <Group>
                <Button size="sm" ref={setPrevious}>
                  Prev
                </Button>
                <Button size="sm">Next</Button>
              </Group>
            </Popover.Footer>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
