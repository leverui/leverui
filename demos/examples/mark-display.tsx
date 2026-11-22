import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Mark, Stack, Text } from '../../src';

const variants = ['subtle', 'solid', 'text', 'plain'] as const;

/** Emphasize the design-system phrase. */
export function MarkBasic(): JSX.Element {
  return (
    <Text>
      Orders placed <Mark variant="subtle">before 2 pm</Mark> ship the same day
    </Text>
  );
}

/** Compare the four mark treatments in order. */
export function MarkWithVariants(): JSX.Element {
  return (
    <Stack gap="6">
      <For each={variants}>
        {
          /** Apply one variant to the same sentence. */
          (variant) => (
            <Text>
              Orders placed <Mark variant={variant}>before 2 pm</Mark> ship the same day
            </Text>
          )
        }
      </For>
    </Stack>
  );
}
