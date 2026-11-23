import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Input, Popover, Portal, Text } from '../../src';

/** Show the default Popover form from the gallery. */
export function PopoverBasic(): JSX.Element {
  return (
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
      <Portal>
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
              <Input placeholder="Your favorite character" size="sm" />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

/** Keep the controlled open state in a Solid signal. */
export function PopoverControlled(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  return (
    <Popover.Root
      open={open()}
      onOpenChange={
        /** Mirror the open state into the controlled signal. */
        (details) => setOpen(details.open)
      }
    >
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
            <Popover.Arrow />
            <Popover.Body>A signal in your code opens and closes this popover.</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

/** Mount the Popover panel only when its presence machine opens. */
export function PopoverLazyMounted(): JSX.Element {
  return (
    <Popover.Root lazyMount unmountOnExit>
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
      </Portal>
    </Popover.Root>
  );
}

/** Apply the light blue Popover surface token. */
export function PopoverCustomBg(): JSX.Element {
  return (
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
      <Portal>
        <Popover.Positioner>
          <Popover.Content style={{ '--lui-popover-background': 'lightblue' }}>
            <Popover.Arrow />
            <Popover.Body>
              <Popover.Title style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>
                Lanternwright Notes
              </Popover.Title>
              <Text style={{ 'margin-block': 'var(--lui-spacing-4)' }}>
                The Lanternwright Chronicles is a fantasy novel series about an apprentice
                lamplighter in a city that rearranges itself every night.
              </Text>
              <Input
                style={{ background: 'var(--lui-colors-bg)' }}
                placeholder="Your favorite character"
                size="sm"
              />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
