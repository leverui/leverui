import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Blockquote, Box, Flex, HStack, Stack, Text } from '../../src';
import { colorPalettes } from './playground-matrix';
import './blockquote-labels.css';

/** Show the Blockquote without a caption or decorative icon. */
export function BlockquoteBasic(): JSX.Element {
  return (
    <Blockquote.Root>
      <Blockquote.Content>
        Keep one lantern lit for the street you know and another for the street you have not found
        yet. A city is only lost when its people stop looking for the corners they have not seen.
      </Blockquote.Content>
    </Blockquote.Root>
  );
}

/** Attach a cite attribute and visible attribution to the quote. */
export function BlockquoteWithCite(): JSX.Element {
  return (
    <Blockquote.Root>
      <Blockquote.Content cite="Wren Ashford">
        Keep one lantern lit for the street you know and another for the street you have not found
        yet. A city is only lost when its people stop looking for the corners they have not seen.
      </Blockquote.Content>
      <Blockquote.Caption>
        — <cite>Wren Ashford</cite>
      </Blockquote.Caption>
    </Blockquote.Root>
  );
}

/** Show the cited quote in every color palette. */
export function BlockquoteWithColors(): JSX.Element {
  return (
    <Stack gap="5" align="flex-start">
      <For each={colorPalettes}>
        {
          /** Label one palette beside its quote. */
          (colorPalette) => (
            <Stack align="center" direction="row" gap="10" class="example-blockquote-row">
              <Text class="example-blockquote-label">{colorPalette}</Text>
              <Blockquote.Root colorPalette={colorPalette}>
                <Blockquote.Content cite="Wren Ashford">
                  Keep one lantern lit for the street you know and another for the street you have
                  not found yet. A city is only lost when its people stop looking for the corners
                  they have not seen.
                </Blockquote.Content>
                <Blockquote.Caption>
                  — <cite>Wren Ashford</cite>
                </Blockquote.Caption>
              </Blockquote.Root>
            </Stack>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare the subtle and solid Blockquote variants. */
export function BlockquoteWithVariants(): JSX.Element {
  return (
    <Stack gap="8">
      <Blockquote.Root variant="subtle">
        <Blockquote.Content>
          Keep one lantern lit for the street you know and another for the street you have not found
          yet. A city is only lost when its people stop looking for the corners they have not seen.
        </Blockquote.Content>
      </Blockquote.Root>
      <Blockquote.Root variant="solid">
        <Blockquote.Content>
          Keep one lantern lit for the street you know and another for the street you have not found
          yet. A city is only lost when its people stop looking for the corners they have not seen.
        </Blockquote.Content>
      </Blockquote.Root>
    </Stack>
  );
}

/** Show every public Blockquote part for the guide's anatomy explorer. */
export function BlockquoteExplorerDemo(): JSX.Element {
  return (
    <Box style={{ 'max-width': '400px', padding: 'var(--lui-spacing-4)' }}>
      <Blockquote.Root>
        <Flex style={{ 'align-items': 'flex-start', gap: 'var(--lui-spacing-2)' }}>
          <Blockquote.Icon />
          <Box style={{ flex: '1' }}>
            <Blockquote.Content>
              Keep one lantern lit for the street you know and another for the street you have not
              found yet. A city is only lost when its people stop looking for the corners they have
              not seen.
            </Blockquote.Content>
            <Flex
              style={{
                'align-items': 'center',
                gap: 'var(--lui-spacing-2)',
                'margin-top': 'var(--lui-spacing-2)',
              }}
            >
              <Blockquote.Caption>— Wren Ashford</Blockquote.Caption>
            </Flex>
          </Box>
        </Flex>
      </Blockquote.Root>
    </Box>
  );
}

/** Compare the three Blockquote justification settings. */
export function BlockquoteWithJustify(): JSX.Element {
  return (
    <Stack gap="20">
      <For each={['start', 'center', 'end'] as const}>
        {
          /** Label one justification and render the matching quote. */
          (justify) => (
            <HStack style={{ 'max-width': 'var(--lui-sizes-xl)' }}>
              <Text class="example-blockquote-justify-label">{justify}</Text>
              <Blockquote.Root variant="plain" justify={justify}>
                <Blockquote.Content cite="Wren Ashford">
                  Keep one lantern lit for the street you know and another for the street you have
                  not found yet. A city is only lost when its people stop looking for the corners
                  they have not seen.
                </Blockquote.Content>
                <Blockquote.Caption>
                  — <cite>Wren Ashford</cite>
                </Blockquote.Caption>
              </Blockquote.Root>
            </HStack>
          )
        }
      </For>
    </Stack>
  );
}
