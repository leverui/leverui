import { type JSX } from '@solidjs/web';
import { Button, Popover, Portal } from '../../src';

/** Place the Popover at zero distance from its trigger. */
export function PopoverOffset(): JSX.Element {
  return (
    <Popover.Root positioning={{ offset: { crossAxis: 0, mainAxis: 0 } }}>
      <Popover.Trigger
        asChild={
          /** Forward the trigger props to the styled button. */
          (getProps) => (
            <Button {...getProps()} size="sm" variant="outline">
              Open
            </Button>
          )
        }
      />
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Body>This popover has a custom offset from its trigger</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

/** Anchor the Popover at the trigger's bottom end. */
export function PopoverPlacement(): JSX.Element {
  return (
    <Popover.Root positioning={{ placement: 'bottom-end' }}>
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
            <Popover.Body>This popover lines up with the end of its trigger.</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

/** Match the panel width to the wider trigger button. */
export function PopoverSameWidth(): JSX.Element {
  return (
    <Popover.Root positioning={{ sameWidth: true }}>
      <Popover.Trigger
        asChild={
          /** Retain trigger sizing and the activation props. */
          (getProps) => (
            <Button
              {...getProps()}
              size="sm"
              variant="outline"
              style={{ 'min-width': 'var(--lui-sizes-xs)' }}
            >
              Click me
            </Button>
          )
        }
      />
      <Portal>
        <Popover.Positioner>
          <Popover.Content style={{ width: 'auto' }}>
            <Popover.Arrow />
            <Popover.Body>This popover is as wide as its trigger button.</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
