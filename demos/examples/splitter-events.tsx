import { createSignal, For, onCleanup, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Center, HStack, Span, Splitter, Stack } from '../../src';

type ResizeLogEntry = {
  time: number;
  name: string;
  sizes: string;
};

/** Show the start, throttled resize, and end events from one splitter. */
export function SplitterResizeEvents(): JSX.Element {
  const [eventLog, setEventLog] = createSignal<ResizeLogEntry[]>([]);
  let lastResizeLog = 0;
  let pendingLog: ReturnType<typeof setTimeout> | undefined;

  /** Prepend an event with its timestamp and optional current panel sizes. */
  function logEvent(name: string, details?: { size: number[] }): void {
    const sizes = details?.size
      .map(
        /** Format one percentage for the log. */
        (size) => size.toFixed(1),
      )
      .join(', ');
    setEventLog(
      /** Put the most recent event first. */
      (previous) => [{ time: Date.now(), name, sizes: sizes ? `[${sizes}]` : '' }, ...previous],
    );
  }

  /** Record a resize immediately or once the 100 ms throttle interval ends. */
  function logResize(details: { size: number[] }): void {
    const elapsed = Date.now() - lastResizeLog;
    if (elapsed >= 100) {
      lastResizeLog = Date.now();
      logEvent('onResize', details);
      return;
    }
    if (pendingLog) clearTimeout(pendingLog);
    pendingLog = setTimeout(
      /** Flush the latest resize after the throttle interval. */
      () => {
        lastResizeLog = Date.now();
        pendingLog = undefined;
        logEvent('onResize', details);
      },
      100 - elapsed,
    );
  }

  /** Record the beginning of a resize gesture. */
  function logResizeStart(): void {
    logEvent('onResizeStart');
  }

  /** Record the completed panel sizes. */
  function logResizeEnd(details: { size: number[] }): void {
    logEvent('onResizeEnd', details);
  }

  /** Cancel a queued log when the story is removed. */
  function clearPendingLog(): void {
    if (pendingLog) clearTimeout(pendingLog);
  }

  onCleanup(clearPendingLog);

  return (
    <Stack gap="4" align="start">
      <HStack gap="2" textStyle="sm">
        <Span>Drag the handle to resize panels</Span>
      </HStack>
      <Splitter.Root
        panels={[{ id: 'a' }, { id: 'b' }]}
        defaultSize={[50, 50]}
        class="splitter-example-framed"
        onResizeStart={logResizeStart}
        onResize={logResize}
        onResizeEnd={logResizeEnd}
      >
        <Splitter.Panel id="a">
          <Center textStyle="2xl" style={{ width: '100%', height: '100%' }}>
            A
          </Center>
        </Splitter.Panel>
        <Splitter.ResizeTrigger id="a:b" />
        <Splitter.Panel id="b">
          <Center textStyle="2xl" style={{ width: '100%', height: '100%' }}>
            B
          </Center>
        </Splitter.Panel>
      </Splitter.Root>
      <Stack
        gap="1"

        role="log"

        style={{
          padding: 'var(--lui-spacing-2)',
          width: '100%',
          'border-width': '1px',
          'min-height': '100px',
          'max-height': '200px',
          'overflow-y': 'auto',
        }}
      >
        <Show
          when={eventLog().length > 0}
          fallback={
            <Span
              textStyle="sm"
              style={{
                color: 'var(--lui-colors-fg-muted)',
              }}
            >
              Resize events will appear here...
            </Span>
          }
        >
          <For each={eventLog()}>
            {
              /** Show the time, event name, and optional sizes for one entry. */
              (entry) => (
                <HStack
                  as="pre"
                  textStyle="sm"
                  style={{
                    'font-family': 'var(--lui-fonts-mono)',
                  }}
                >
                  <Span style={{ color: 'var(--lui-colors-fg-muted)' }}>
                    {new Date(entry.time).toLocaleTimeString()}
                  </Span>
                  <Span style={{ 'font-weight': 'var(--lui-font-weights-bold)' }}>
                    {entry.name}
                  </Span>
                  <Show when={entry.sizes}>
                    <Span style={{ color: 'var(--lui-colors-fg-muted)' }}>{entry.sizes}</Span>
                  </Show>
                </HStack>
              )
            }
          </For>
        </Show>
      </Stack>
    </Stack>
  );
}
