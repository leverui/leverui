import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Avatar, Circle, Float, HStack, Stack, Text } from '../../src';
import { colorPalettes } from './playground-matrix';

/** Place the green online badge over an Avatar corner. */
export function AvatarWithBadge(): JSX.Element {
  return (
    <Avatar.Root colorPalette="green" variant="subtle">
      <Avatar.Fallback name="Rhea Solano" />
      <Float placement="bottom-end" offsetX="1" offsetY="1">
        <Circle
          size="8px"
          style={{
            background: 'var(--lui-colors-green-500)',
            outline: '0.2em solid var(--lui-colors-bg)',
          }}
        />
      </Float>
    </Avatar.Root>
  );
}

/** Compare image, initials, and generic fallback for every palette. */
export function AvatarWithColors(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={colorPalettes}>
        {/** Render one palette's three Avatar states. */}
        {(colorPalette) => (
          <Stack align="center" direction="row" gap="10">
            <Text style={{ 'min-width': '8ch' }}>{colorPalette}</Text>
            <Avatar.Root colorPalette={colorPalette}>
              <Avatar.Fallback name="Mara Ellison" />
              <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
            </Avatar.Root>
            <Avatar.Root colorPalette={colorPalette}>
              <Avatar.Fallback name="Mara Ellison" />
            </Avatar.Root>
            <Avatar.Root colorPalette={colorPalette}>
              <Avatar.Fallback />
            </Avatar.Root>
          </Stack>
        )}
      </For>
    </Stack>
  );
}

const randomPalettes = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'] as const;

/** Select a stable palette from the first letter of a display name. */
function pickPalette(name: string): (typeof randomPalettes)[number] {
  const index = name.charCodeAt(0) % randomPalettes.length;
  const palette = randomPalettes[index];
  if (!palette) throw new Error('Avatar palette lookup failed.');
  return palette;
}

/** Demonstrate deterministic colors for three names. */
export function AvatarWithRandomColor(): JSX.Element {
  return (
    <HStack>
      <Avatar.Root colorPalette={pickPalette('Nadia Quill')}>
        <Avatar.Fallback name="Nadia Quill" />
      </Avatar.Root>
      <Avatar.Root colorPalette={pickPalette('Iris Calder')}>
        <Avatar.Fallback name="Iris Calder" />
      </Avatar.Root>
      <Avatar.Root colorPalette={pickPalette('Theo Park')}>
        <Avatar.Fallback name="Theo Park" />
      </Avatar.Root>
    </HStack>
  );
}
