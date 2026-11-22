import { createSignal, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Show, Stack, Text } from '../../src';

/** Own the click count shared by the two interactive examples. */
function useCounter(): { count: Accessor<number>; increment: () => void } {
  const [count, setCount] = createSignal(0);
  /** Increment the count and update the conditional branch. */
  function increment(): void {
    setCount(count() + 1);
  }
  return { count, increment };
}

/** Reveal the content after four button clicks. */
export function ShowBasic(): JSX.Element {
  const { count, increment } = useCounter();
  return (
    <Stack align="flex-start">
      <Button variant="outline" onClick={increment}>
        Value: {count()}
      </Button>
      <Show when={count() > 3}>
        <div>This line shows after four clicks.</div>
      </Show>
    </Stack>
  );
}

/** Display the fallback until four clicks reveal the content. */
export function ShowWithFallback(): JSX.Element {
  const { count, increment } = useCounter();
  return (
    <Stack align="flex-start">
      <Button variant="outline" onClick={increment}>
        Value: {count()}
      </Button>
      <Show when={count() > 3} fallback={<Text>Not there yet. Keep clicking...</Text>}>
        <div>You made it. Here is the content.</div>
      </Show>
    </Stack>
  );
}

/** Pass the narrowed value to an idiomatic Solid render function. */
export function ShowWithRenderProp(): JSX.Element {
  const value: number | undefined = 10;
  return (
    <Show when={value}>
      {
        /** Read Solid's accessor when the truthy branch is active. */ (current) => (
          <div>Value: {current()}</div>
        )
      }
    </Show>
  );
}
