import { createSignal, onCleanup } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ClientOnly, Code, Skeleton, Stack, Text } from '../../src';
import './client-only-examples.css';

/** Show content that renders only after the page mounts. */
export function ClientOnlyBasic(): JSX.Element {
  return (
    <ClientOnly>
      <Text>This text appears only after the page loads in the browser.</Text>
    </ClientOnly>
  );
}

/** Display the current time and update it once per second. */
function Clock(): JSX.Element {
  const [time, setTime] = createSignal(new Date().toLocaleTimeString());
  const interval = window.setInterval(
    /** Refresh the displayed time. */
    () => setTime(new Date().toLocaleTimeString()),
    1000,
  );
  onCleanup(
    /** Stop the timer when the clock unmounts. */
    () => window.clearInterval(interval),
  );
  return <Text>Current time: {time()}</Text>;
}

/** Show a skeleton until the client-only clock mounts. */
export function ClientOnlyWithFallback(): JSX.Element {
  return (
    <ClientOnly fallback={<Skeleton class="example-client-only-clock-placeholder" />}>
      {
        /** Render the clock once the client has mounted. */
        () => (
          <Stack gap="1">
            <Text class="example-client-only-title">Browser clock</Text>
            <Clock />
          </Stack>
        )
      }
    </ClientOnly>
  );
}

/** Read browser-only values inside a render function. */
export function ClientOnlyRenderProp(): JSX.Element {
  return (
    <ClientOnly fallback={<Skeleton class="example-client-only-details-placeholder" />}>
      {
        /** Read browser values once the client has mounted. */
        () => (
          <Stack align="flex-start" gap="1" textStyle="sm">
            <Text>
              Current URL: <Code>{window.location.href}</Code>
            </Text>
            <Text>
              Window width: <Code>{window.innerWidth}px</Code>
            </Text>
          </Stack>
        )
      }
    </ClientOnly>
  );
}
