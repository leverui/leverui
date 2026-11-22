import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Center, SimpleGrid, Stack, Text, VStack } from '../../src';
import { TokenDoc } from './token-doc-frame';
import { tokenDocEntries, tokenDocKeyframes } from './token-doc-css';

/** Animate every public keyframe except internal transition and progress rules. */
export function TokensKeyframes(): JSX.Element {
  const names = tokenDocKeyframes().filter(
    /** Keep the same public animation selection as the gallery. */
    (name) => !/expand|collapse|bg-|position|circular/.test(name),
  );
  return (
    <TokenDoc title="theme.keyframes" mt="8">
      <SimpleGrid
        minChildWidth="160px"
        style={{ gap: 'var(--leverui-spacing-20)', 'font-size': 'var(--leverui-font-sizes-sm)' }}
      >
        <For each={names}>
          {
            /** Display a looping specimen for one keyframe rule. */
            (name) => (
              <Stack>
                <Box
                  style={{
                    width: 'var(--leverui-sizes-12)',
                    height: 'var(--leverui-sizes-12)',
                    background: 'var(--leverui-colors-pink-200)',
                    animation: `${name} 1s ease-in-out infinite alternate`,
                  }}
                />
                <Text style={{ 'font-weight': 'var(--leverui-font-weights-medium)' }}>{name}</Text>
              </Stack>
            )
          }
        </For>
      </SimpleGrid>
    </TokenDoc>
  );
}

/** List configured durations in descending order with animated samples. */
export function TokensDurations(): JSX.Element {
  const names = tokenDocEntries('durations')
    .sort(
      /** Put the slowest token first,. */
      (first, second) => parseFloat(second.originalValue) - parseFloat(first.originalValue),
    )
    .map(
      /** Retain each sorted duration's token name. */
      (token) => token.extensions.prop,
    );
  return (
    <TokenDoc title="theme.tokens.durations" mt="8">
      <SimpleGrid
        minChildWidth="160px"
        style={{ gap: 'var(--leverui-spacing-20)', 'font-size': 'var(--leverui-font-sizes-sm)' }}
      >
        <For each={names}>
          {
            /** Animate a line with this duration token. */
            (name) => (
              <VStack>
                <Center style={{ height: 'var(--leverui-sizes-20)' }}>
                  <Box
                    style={{
                      background: 'var(--leverui-colors-pink-200)',
                      height: 'var(--leverui-sizes-1)',
                      width: 'var(--leverui-sizes-20)',
                      'animation-name': 'spin',
                      'animation-duration': `var(--leverui-durations-${name})`,
                      'animation-timing-function': 'ease-in-out',
                      'animation-iteration-count': 'infinite',
                      'animation-direction': 'alternate',
                    }}
                  />
                </Center>
                <Text style={{ 'font-weight': 'var(--leverui-font-weights-medium)' }}>{name}</Text>
              </VStack>
            )
          }
        </For>
      </SimpleGrid>
    </TokenDoc>
  );
}
