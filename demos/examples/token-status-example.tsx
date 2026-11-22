import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Center, SimpleGrid, Text } from '../../src';

const statuses = ['error', 'warning', 'success', 'info'] as const;

/** Display background, foreground, and border status token families. */
export function TokensStatusTokens(): JSX.Element {
  return (
    <SimpleGrid columns={4} style={{ gap: 'var(--leverui-spacing-10)' }}>
      <For each={statuses}>
        {
          /** Pair a status background with its matching foreground. */
          (status) => (
            <Center style={{ background: `var(--leverui-colors-bg-${status})`, height: '40px' }}>
              <Text style={{ color: `var(--leverui-colors-fg-${status})` }}>{`bg.${status}`}</Text>
            </Center>
          )
        }
      </For>
      <For each={statuses}>
        {
          /** Show the status foreground as a full sample surface. */
          (status) => (
            <Center style={{ background: `var(--leverui-colors-fg-${status})`, height: '40px' }}>
              <Text style={{ color: 'var(--leverui-colors-fg-inverted)' }}>{`fg.${status}`}</Text>
            </Center>
          )
        }
      </For>
      <For each={statuses}>
        {
          /** Outline one surface with its status border token. */
          (status) => (
            <Center
              style={{
                'border-color': `var(--leverui-colors-border-${status})`,
                'border-width': '2px',
                height: '40px',
              }}
            >
              <Text style={{ color: 'var(--leverui-colors-fg)' }}>{`border.${status}`}</Text>
            </Center>
          )
        }
      </For>
    </SimpleGrid>
  );
}
