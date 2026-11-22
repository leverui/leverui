import { createSignal, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Tabs } from '../../src';

/** Count seconds only while the active lazy panel is mounted. */
function TickValue(): JSX.Element {
  const [value, setValue] = createSignal(0);
  let interval: number | undefined;

  /** Advance the visible counter once per second. */
  function tick(): void {
    setValue(
      /** Advance from the last visible tick. */
      (previous) => previous + 1,
    );
  }

  /** Start the timer when this panel mounts, and release it when the panel unmounts. */
  function start(): () => void {
    interval = window.setInterval(tick, 1000);
    return stop;
  }

  /** Release the timer. */
  function stop(): void {
    window.clearInterval(interval);
  }

  onSettled(start);
  return <span style={{ 'font-weight': 'bold', color: 'tomato', padding: '4px' }}>{value()}</span>;
}

/** Show the lazy panel mounting and unmounting. */
export function TabsLazyMounted(): JSX.Element {
  return (
    <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
      <Tabs.List>
        <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab-3">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab-1">
        Tab 1: Content <TickValue />
      </Tabs.Content>
      <Tabs.Content value="tab-2">
        Tab 2: Content <TickValue />
      </Tabs.Content>
      <Tabs.Content value="tab-3">
        Tab 3: Content <TickValue />
      </Tabs.Content>
    </Tabs.Root>
  );
}
