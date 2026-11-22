import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Alert, Button, Center, Presence, Stack } from '../../src';
import './presence-center.css';

/** Defer the first DOM mount until the user opens the panel. */
export function PresenceLazyMount(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  /** Toggle the panel's presence. */
  function toggle(): void {
    setOpen(
      /** Flip the open state. */
      (current) => !current,
    );
  }

  return (
    <Stack gap="4">
      <Alert.Root>
        <Alert.Indicator />
        <Alert.Title>Inspect the page. The panel is not in the DOM until you open it.</Alert.Title>
      </Alert.Root>
      <Button class="presence-example-trigger" onClick={toggle}>
        Click me
      </Button>
      <Presence class="presence-example-motion presence-example-fade" lazyMount present={open()}>
        <Center class="presence-example-center">Fade</Center>
      </Presence>
    </Stack>
  );
}

/** Remove the panel from the DOM after its closing animation finishes. */
export function PresenceUnmountOnExit(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  /** Toggle the panel's presence. */
  function toggle(): void {
    setOpen(
      /** Flip the open state. */
      (current) => !current,
    );
  }

  return (
    <Stack gap="4">
      <Alert.Root>
        <Alert.Indicator />
        <Alert.Title>
          Inspect the page. The panel is removed from the DOM after it closes.
        </Alert.Title>
      </Alert.Root>
      <Button class="presence-example-trigger" onClick={toggle}>
        Click me
      </Button>
      <Presence
        class="presence-example-motion presence-example-fade"
        unmountOnExit
        present={open()}
      >
        <Center class="presence-example-center">Fade</Center>
      </Presence>
    </Stack>
  );
}
