import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, HStack, Stack, Text, toaster } from '../../src';

type StatusEntry = readonly [number, string];

/** Record each toast status from mounting through removal. */
export function ToastLifecycle(): JSX.Element {
  const [entries, setEntries] = createSignal<StatusEntry[]>([]);
  const [dismissed, setDismissed] = createSignal(true);

  /** Open one toast and publish each status transition in the log. */
  function showToast(): void {
    toaster.create({
      description: 'Each status change of this toast is added to the log.',
      type: 'info',
      /** Unlock the trigger when the toast leaves the DOM. */
      onStatusChange({ status }) {
        setDismissed(status === 'unmounted');
        setEntries(
          /** Prepend the timestamped status. */
          (previous) => [[Date.now(), status], ...previous],
        );
      },
    });
  }

  return (
    <Stack align="flex-start">
      <Button disabled={!dismissed()} variant="outline" size="sm" onClick={showToast}>
        Show toast
      </Button>
      <Stack
        role="log"
        style={{
          padding: 'var(--lui-spacing-2)',
          width: '100%',
          'border-width': '1px',
          'min-height': '100px',
        }}
      >
        <For each={entries()}>
          {
            /** Show the newest machine status first. */
            ([time, status]) => (
              <HStack
                as="pre"
                textStyle="sm"
                style={{
                  'font-family': 'var(--lui-fonts-mono)',
                }}
              >
                {new Date(time).toLocaleTimeString()}{' '}
                <Text style={{ 'font-weight': 'var(--lui-font-weights-bold)' }}>{status}</Text>
              </HStack>
            )
          }
        </For>
      </Stack>
    </Stack>
  );
}
