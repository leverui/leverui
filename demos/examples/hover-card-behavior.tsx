import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, HoverCard, Link, Portal, Strong } from '../../src';
import './hover-card-examples.css';

/** Keep the preview's open state in a Solid signal. */
export function HoverCardControlled(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  return (
    <HoverCard.Root
      size="sm"
      open={open()}
      onOpenChange={
        /** Reflect the open state into the controlled signal. */
        (details) => setOpen(details.open)
      }
    >
      <HoverCard.Trigger
        asChild={
          /** Preserve the machine's hover and focus handlers on the link. */
          (getProps) => (
            <Link {...getProps()} href="#">
              @leverui
            </Link>
          )
        }
      />
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content class="hover-card-example-narrow">
            <HoverCard.Arrow />
            <Box>
              <Strong>Lever UI</Strong> brings accessible components and flexible styling to SolidJS
              applications.
            </Box>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}

/** Delay opening and closing by the exact millisecond values. */
export function HoverCardWithDelay(): JSX.Element {
  return (
    <HoverCard.Root size="sm" openDelay={1000} closeDelay={100}>
      <HoverCard.Trigger
        asChild={
          /** Preserve the machine's hover and focus handlers on the link. */
          (getProps) => (
            <Link {...getProps()} href="#">
              @leverui
            </Link>
          )
        }
      />
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content class="hover-card-example-narrow">
            <HoverCard.Arrow />
            <Box>
              <Strong>Lever UI</Strong> brings accessible components and flexible styling to SolidJS
              applications.
            </Box>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}

/** Place the preview above its trigger. */
export function HoverCardWithPlacement(): JSX.Element {
  return (
    <HoverCard.Root size="sm" positioning={{ placement: 'top' }}>
      <HoverCard.Trigger
        asChild={
          /** Preserve the machine's hover and focus handlers on the link. */
          (getProps) => (
            <Link {...getProps()} href="#">
              @leverui
            </Link>
          )
        }
      />
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content class="hover-card-example-narrow">
            <HoverCard.Arrow />
            <Box>
              <Strong>Lever UI</Strong> brings accessible components and flexible styling to SolidJS
              applications.
            </Box>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}
