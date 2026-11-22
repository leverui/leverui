import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Tabs } from '../../src';

/** Match the animated absolute-positioned panel content. */
export function TabsAnimation(): JSX.Element {
  const items = [
    { value: '1', content: 'This panel fades and grows into place when it opens.' },
    {
      value: '2',
      content: 'The second panel uses the same animation. Switch between the tabs to see it again.',
    },
  ];
  return (
    <Tabs.Root defaultValue="1" style={{ width: '100%' }}>
      <Tabs.List>
        <For each={items}>
          {(item) => <Tabs.Trigger value={item.value}>Tab {item.value}</Tabs.Trigger>}
        </For>
      </Tabs.List>
      <Box style={{ position: 'relative', 'min-height': '200px', width: '100%' }}>
        <For each={items}>
          {(item) => (
            <Tabs.Content value={item.value} class="tabs-example-animation-panel">
              {item.content}
            </Tabs.Content>
          )}
        </For>
      </Box>
    </Tabs.Root>
  );
}
