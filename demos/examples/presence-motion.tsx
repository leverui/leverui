import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Center, Presence, Stack } from '../../src';
import './presence-center.css';

/** Fade a muted panel in and out. */
export function PresenceFade(): JSX.Element {
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
      <Button class="presence-example-trigger" onClick={toggle}>
        Click me
      </Button>
      <Presence class="presence-example-motion presence-example-fade" present={open()}>
        <Center class="presence-example-center">Fade</Center>
      </Presence>
    </Stack>
  );
}

/** Combine scale and fade through paired animation names. */
export function PresenceScaleFade(): JSX.Element {
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
      <Button class="presence-example-trigger" onClick={toggle}>
        Click me
      </Button>
      <Presence class="presence-example-motion presence-example-scale" present={open()}>
        <Center class="presence-example-center">Scale fade</Center>
      </Presence>
    </Stack>
  );
}

/** Slide a muted panel while fading its opacity. */
export function PresenceSlideFade(): JSX.Element {
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
      <Button class="presence-example-trigger" onClick={toggle}>
        Click me
      </Button>
      <Presence class="presence-example-motion presence-example-slide-fade" present={open()}>
        <Center class="presence-example-center">Slide fade</Center>
      </Presence>
    </Stack>
  );
}

/** Slide a fixed panel up from the viewport bottom. */
export function PresenceSlide(): JSX.Element {
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
      <Button class="presence-example-trigger" onClick={toggle}>
        Click me
      </Button>
      <Presence class="presence-example-motion presence-example-slide" present={open()}>
        <Center class="presence-example-center presence-example-center-rounded">Slide</Center>
      </Presence>
    </Stack>
  );
}
