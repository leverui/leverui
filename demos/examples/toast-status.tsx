import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, HStack, toaster } from '../../src';

/** Dismiss visible notifications from a separate button. */
export function ToastExternalClose(): JSX.Element {
  /** Publish a notification to dismiss later. */
  function showToast(): void {
    toaster.create({ description: 'File saved successfully', type: 'info' });
  }

  /** Remove every currently visible toast. */
  function closeToasts(): void {
    toaster.dismiss();
  }

  return (
    <HStack>
      <Button variant="outline" size="sm" onClick={showToast}>
        Show toast
      </Button>
      <Button variant="outline" size="sm" onClick={closeToasts}>
        Close toasts
      </Button>
    </HStack>
  );
}

/** Present one trigger for each toast type. */
export function ToastStatus(): JSX.Element {
  return (
    <HStack>
      <For each={['success', 'error', 'warning', 'info'] as const}>
        {
          /** Give each type its own trigger. */
          (type) => {
            /** Create a notification of this type. */
            function showStatus(): void {
              toaster.create({ title: `Toast status is ${type}`, type });
            }
            return (
              <Button size="sm" variant="outline" onClick={showStatus}>
                {type}
              </Button>
            );
          }
        }
      </For>
    </HStack>
  );
}
