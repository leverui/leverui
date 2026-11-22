import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PhoneIcon, SearchIcon, VoicemailIcon } from '@lucide/solid';
import { HStack, IconButton, Text, VStack } from '../../src';
import { colorPalettes } from './playground-matrix';

/** Show one default icon-only button with its accessible name. */
export function IconButtonBasic(): JSX.Element {
  return (
    <IconButton aria-label="Search database">
      <SearchIcon />
    </IconButton>
  );
}

/** Apply the full rounding to the support button. */
export function IconButtonRounded(): JSX.Element {
  return (
    <IconButton aria-label="Call support" style={{ 'border-radius': 'var(--leverui-radii-full)' }}>
      <VoicemailIcon />
    </IconButton>
  );
}

/** Show all ten color palettes in one wrapped row. */
export function IconButtonWithColors(): JSX.Element {
  return (
    <HStack wrap="wrap">
      <For each={colorPalettes}>
        {
          /** Render one search button for a color palette. */
          (palette) => (
            <IconButton aria-label="Search database" colorPalette={palette}>
              <SearchIcon />
            </IconButton>
          )
        }
      </For>
    </HStack>
  );
}

/** Compare the four icon button sizes. */
export function IconButtonWithSizes(): JSX.Element {
  return (
    <HStack wrap="wrap" gap="8">
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {
          /** Render one outlined phone button with its size label. */
          (size) => (
            <VStack>
              <IconButton aria-label="Search database" variant="outline" size={size}>
                <PhoneIcon />
              </IconButton>
              <Text textStyle="sm">{size}</Text>
            </VStack>
          )
        }
      </For>
    </HStack>
  );
}

/** Compare the five icon button variants. */
export function IconButtonWithVariants(): JSX.Element {
  return (
    <HStack wrap="wrap" gap="8">
      <For each={['solid', 'subtle', 'surface', 'outline', 'ghost'] as const}>
        {
          /** Render one support button with its variant label. */
          (variant) => (
            <VStack>
              <IconButton aria-label="Call support" variant={variant}>
                <VoicemailIcon />
              </IconButton>
              <Text textStyle="sm">{variant}</Text>
            </VStack>
          )
        }
      </For>
    </HStack>
  );
}
