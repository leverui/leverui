import { createSignal, createUniqueId } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PauseIcon, PlayIcon } from '@lucide/solid';
import { Button, HStack, toaster } from '../../src';

/** Pause and resume a toast's remaining lifetime. */
export function ToastPauseAndPlay(): JSX.Element {
  const id = createUniqueId();
  const [paused, setPaused] = createSignal(false);
  const [shown, setShown] = createSignal(false);

  /** Publish the toast and track when it can be paused. */
  function show(): void {
    toaster.success({
      id,
      title: 'Pause this toast to keep it on screen',
      /** Enable the controls while the toast is visible. */
      onStatusChange(details) {
        if (details.status === 'visible') setShown(true);
        else if (details.status === 'dismissing') setShown(false);
      },
    });
  }

  /** Stop the toast's timer. */
  function pause(): void {
    toaster.pause(id);
    setPaused(true);
  }

  /** Restart the toast's timer with its remaining duration. */
  function play(): void {
    toaster.resume(id);
    setPaused(false);
  }

  return (
    <HStack>
      <Button variant="outline" size="sm" onClick={show} disabled={shown()}>
        Show toast
      </Button>
      <Button variant="outline" size="sm" onClick={pause} disabled={!shown() || paused()}>
        <PauseIcon />
        Pause toast
      </Button>
      <Button variant="outline" size="sm" onClick={play} disabled={!shown() || !paused()}>
        <PlayIcon />
        Play toast
      </Button>
    </HStack>
  );
}
