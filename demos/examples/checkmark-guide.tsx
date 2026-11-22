import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Checkmark, HStack, Stack } from '../../src';
import { colorPalettes } from './playground-matrix';

const variants = ['solid', 'outline', 'subtle', 'plain', 'inverted'] as const;
const sizes = ['xs', 'sm', 'md', 'lg'] as const;

/** Show the six Checkmark states in a vertical stack. */
export function CheckmarkBasic(): JSX.Element {
  return (
    <Stack>
      <Checkmark />
      <Checkmark checked />
      <Checkmark indeterminate />
      <Checkmark disabled />
      <Checkmark checked disabled />
      <Checkmark indeterminate disabled />
    </Stack>
  );
}

/** Compare unchecked, checked, and indeterminate Checkmarks. */
export function CheckmarkIndeterminate(): JSX.Element {
  return (
    <HStack gap="4">
      <Checkmark />
      <Checkmark checked />
      <Checkmark indeterminate />
    </HStack>
  );
}

/** Show every enabled and disabled Checkmark state in one row. */
export function CheckmarkStates(): JSX.Element {
  return (
    <HStack gap="3">
      <Checkmark />
      <Checkmark checked />
      <Checkmark indeterminate />
      <Checkmark disabled />
      <Checkmark checked disabled />
      <Checkmark indeterminate disabled />
    </HStack>
  );
}

/** Compare the Checkmark variants. */
export function CheckmarkWithVariants(): JSX.Element {
  return (
    <HStack gap="4">
      <For each={variants}>
        {
          /** Render one checked mark per variant. */
          (variant) => <Checkmark variant={variant} checked />
        }
      </For>
    </HStack>
  );
}

/** Compare the Checkmark sizes. */
export function CheckmarkWithSizes(): JSX.Element {
  return (
    <HStack gap="4" align="center">
      <For each={sizes}>
        {
          /** Render one checked mark per size. */
          (size) => <Checkmark size={size} checked />
        }
      </For>
    </HStack>
  );
}

/** Show a checked mark in every color palette. */
export function CheckmarkWithColors(): JSX.Element {
  return (
    <HStack gap="4">
      <For each={colorPalettes}>
        {
          /** Render one checked mark per palette. */
          (colorPalette) => <Checkmark colorPalette={colorPalette} checked />
        }
      </For>
    </HStack>
  );
}

/** Add a background to the outline variant. */
export function CheckmarkWithFilled(): JSX.Element {
  return <Checkmark variant="outline" filled />;
}
