import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PlusIcon } from '@lucide/solid';
import { Stack, Tag, Text } from '../../src';
import { colorPalettes } from './playground-matrix';

/** Display the ten color palettes with three tag styles each. */
export function TagWithColors(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={colorPalettes}>
        {
          /** Render one palette row with plain, leading-icon, and solid closable tags. */
          (colorPalette) => (
            <Stack
              align="center"
              direction="row"
              gap="10"
              style={{ 'padding-inline': 'var(--leverui-spacing-4)' }}
            >
              <Text style={{ 'min-width': '8ch' }}>{colorPalette}</Text>
              <Tag.Root size="sm" colorPalette={colorPalette}>
                <Tag.Label>Content</Tag.Label>
              </Tag.Root>
              <Tag.Root size="sm" colorPalette={colorPalette}>
                <Tag.StartElement>
                  <PlusIcon />
                </Tag.StartElement>
                <Tag.Label>Content</Tag.Label>
              </Tag.Root>
              <Tag.Root colorPalette={colorPalette} variant="solid">
                <Tag.Label>Content</Tag.Label>
                <Tag.EndElement>
                  <Tag.CloseTrigger />
                </Tag.EndElement>
              </Tag.Root>
            </Stack>
          )
        }
      </For>
    </Stack>
  );
}
