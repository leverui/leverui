import { type JSX } from '@solidjs/web';
import { BoxIcon } from '@lucide/solid';
import { Box, For, Stack, Text, VStack } from '../../src';
import './for-examples.css';

/** Render one element for each string. */
export function ForBasic(): JSX.Element {
  return (
    <For each={['One', 'Two', 'Three']}>
      {
        /** Render one string. */
        (item) => <div>{item}</div>
      }
    </For>
  );
}

const characters = [
  { name: 'Wren', powers: ['Lightweaving', 'Pathfinding'] },
  { name: 'Corin', powers: ['Stormcalling', 'Farsight'] },
  { name: 'Mira', powers: ['Healing', 'Stonecraft'] },
];

/** Render a card for each object in the array. */
export function ForWithObject(): JSX.Element {
  return (
    <Stack>
      <For each={characters}>
        {
          /** Render one character card. */
          (item) => (
            <Box class="example-for-card">
              <Text class="example-for-name">{item.name}</Text>
              <Text class="example-for-powers">Powers: {item.powers.join(', ')}</Text>
            </Box>
          )
        }
      </For>
    </Stack>
  );
}

const emptyItems: readonly string[] = [];

/** Show fallback content while the array has no items. */
export function ForWithFallback(): JSX.Element {
  return (
    <Stack gap="4">
      <For
        each={emptyItems}
        fallback={
          <VStack class="example-for-empty">
            <BoxIcon class="example-for-empty-icon" />
            No items to show
          </VStack>
        }
      >
        {
          /** Render one item row. */
          (item) => <Box class="example-for-row">{item}</Box>
        }
      </For>
    </Stack>
  );
}
