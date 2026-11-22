import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { AbsoluteCenter, HStack, ProgressCircle, Stack, Text } from '../../src';
import { colorPalettes } from './playground-matrix';

/** Display 30 circles across the ten color palettes. */
export function ProgressCircleWithColors(): JSX.Element {
  return (
    <Stack gap="4" align="flex-start">
      <For each={colorPalettes}>
        {
          /** Compare three circle sizes for one color palette. */
          (colorPalette) => (
            <HStack gap="10" style={{ 'padding-inline': 'var(--leverui-spacing-4)' }}>
              <Text style={{ 'min-width': '8ch' }}>{colorPalette}</Text>
              <ProgressCircle.Root size="sm" value={30} colorPalette={colorPalette}>
                <ProgressCircle.Circle>
                  <ProgressCircle.Track />
                  <ProgressCircle.Range strokeLinecap="round" />
                </ProgressCircle.Circle>
              </ProgressCircle.Root>
              <ProgressCircle.Root size="md" value={30} colorPalette={colorPalette}>
                <ProgressCircle.Circle>
                  <ProgressCircle.Track />
                  <ProgressCircle.Range strokeLinecap="round" />
                </ProgressCircle.Circle>
              </ProgressCircle.Root>
              <ProgressCircle.Root size="lg" value={30} colorPalette={colorPalette}>
                <ProgressCircle.Circle>
                  <ProgressCircle.Track />
                  <ProgressCircle.Range strokeLinecap="round" />
                </ProgressCircle.Circle>
              </ProgressCircle.Root>
            </HStack>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare all five circle sizes. */
export function ProgressCircleWithSizes(): JSX.Element {
  return (
    <HStack gap="10">
      <For each={['xs', 'sm', 'md', 'lg', 'xl'] as const}>
        {
          /** Render one rounded arc at this size. */
          (size) => (
            <ProgressCircle.Root size={size} value={30}>
              <ProgressCircle.Circle>
                <ProgressCircle.Track />
                <ProgressCircle.Range strokeLinecap="round" />
              </ProgressCircle.Circle>
            </ProgressCircle.Root>
          )
        }
      </For>
    </HStack>
  );
}

/** Compare centered value text at three sizes. */
export function ProgressCircleWithValueText(): JSX.Element {
  return (
    <HStack gap="8">
      <For each={['md', 'lg', 'xl'] as const}>
        {
          /** Center a formatted five-percent value inside one circle. */
          (size) => (
            <ProgressCircle.Root size={size} value={5}>
              <ProgressCircle.Circle>
                <ProgressCircle.Track />
                <ProgressCircle.Range />
              </ProgressCircle.Circle>
              <AbsoluteCenter>
                <ProgressCircle.ValueText />
              </AbsoluteCenter>
            </ProgressCircle.Root>
          )
        }
      </For>
    </HStack>
  );
}
