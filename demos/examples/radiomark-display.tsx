import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, Radiomark, Stack } from '../../src';
import { colorPalettes } from './playground-matrix';

/** Show the unchecked, checked, and disabled states in a column. */
export function RadiomarkBasic(): JSX.Element {
  return (
    <Stack>
      <Radiomark />
      <Radiomark checked />
      <Radiomark disabled />
      <Radiomark checked disabled />
    </Stack>
  );
}

/** Show the unchecked, checked, and disabled states in a row. */
export function RadiomarkStates(): JSX.Element {
  return (
    <HStack gap="4">
      <Radiomark />
      <Radiomark checked />
      <Radiomark disabled />
      <Radiomark checked disabled />
    </HStack>
  );
}

/** Show all four checked variants. */
export function RadiomarkVariants(): JSX.Element {
  return (
    <Stack>
      <For each={['outline', 'subtle', 'solid', 'inverted'] as const}>
        {
          /** Render one checked variant. */
          (variant) => <Radiomark checked variant={variant} />
        }
      </For>
    </Stack>
  );
}

/** Show all four checked sizes. */
export function RadiomarkWithSizes(): JSX.Element {
  return (
    <HStack gap="4" align="center">
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {
          /** Render one checked size. */
          (size) => <Radiomark checked size={size} />
        }
      </For>
    </HStack>
  );
}

/** Show a checked mark in each color palette. */
export function RadiomarkWithColors(): JSX.Element {
  return (
    <HStack gap="4">
      <For each={colorPalettes}>
        {
          /** Render one checked palette. */
          (colorPalette) => <Radiomark checked colorPalette={colorPalette} />
        }
      </For>
    </HStack>
  );
}

/** Compare the outline variant with and without a filled background. */
export function RadiomarkWithFilled(): JSX.Element {
  return (
    <HStack gap="4">
      <Radiomark variant="outline" />
      <Radiomark variant="outline" checked />
      <Radiomark variant="outline" filled />
      <Radiomark variant="outline" filled checked />
    </HStack>
  );
}
