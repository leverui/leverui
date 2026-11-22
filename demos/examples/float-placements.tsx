import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Avatar, Badge, Box, Circle, Float, HStack, Stack } from '../../src';

const placements = [
  'bottom-end',
  'bottom-start',
  'top-end',
  'top-start',
  'bottom-center',
  'top-center',
  'middle-center',
  'middle-end',
  'middle-start',
] as const;

/** Compare every placement on identical positioned surfaces. */
export function FloatWithPlacements(): JSX.Element {
  return (
    <HStack gap="14" wrap="wrap">
      <For each={placements}>
        {
          /** Render one labeled placement specimen. */
          (placement) => (
            <Stack gap="3">
              <p>{placement}</p>
              <Box class="float-example-surface">
                <Float placement={placement}>
                  <Circle size="5" class="float-example-count" aria-hidden="true">
                    3
                  </Circle>
                </Float>
              </Box>
            </Stack>
          )
        }
      </For>
    </HStack>
  );
}

/** Place a teal status badge on the portrait. */
export function FloatWithAvatar(): JSX.Element {
  return (
    <Box class="float-example-avatar-host">
      <Avatar.Root size="lg" shape="rounded">
        <Avatar.Image src="/demo-images/avatars/avatar-3.webp" alt="Profile portrait" />
        <Avatar.Fallback />
      </Avatar.Root>
      <Float placement="bottom-end">
        <Badge size="sm" variant="solid" colorPalette="teal">
          New
        </Badge>
      </Float>
    </Box>
  );
}
