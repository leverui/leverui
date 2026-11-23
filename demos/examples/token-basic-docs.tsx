import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Center, HStack, SimpleGrid, Square, Stack, Text, VStack } from '../../src';
import { TokenDoc } from './token-doc-frame';
import { tokenDocEntries, tokenDocEntry } from './token-doc-css';

const tokens = { getByName: tokenDocEntry };

/** Require easing tokens to contain CSS timing functions. */
function easingValue(value: string | number): string {
  if (typeof value !== 'string') {
    throw new TypeError('An easing token must be a CSS timing function.');
  }
  return value;
}

/** Show each configured aspect ratio with its resolved value. */
export function TokensAspectRatio(): JSX.Element {
  const ratios = tokenDocEntries('aspectRatios');
  return (
    <TokenDoc title="theme.tokens.aspectRatios" mt="8">
      <SimpleGrid
        minChildWidth="160px"
        style={{ gap: 'var(--lui-spacing-8)', 'font-size': 'var(--lui-font-sizes-sm)' }}
      >
        <For each={ratios}>
          {
            /** Render one configured ratio and its source value. */
            (token) => (
              <Stack style={{ flex: '1' }}>
                <Center
                  style={{
                    'aspect-ratio': String(token.value),
                    width: 'var(--lui-sizes-40)',
                    background: 'var(--lui-colors-bg-subtle)',
                    color: 'var(--lui-colors-fg-muted)',
                    'border-width': '1px',
                  }}
                >
                  <VStack gap="0">
                    <Text>{token.extensions.prop}</Text>
                    <Text style={{ color: 'var(--lui-colors-fg-subtle)' }}>{token.value}</Text>
                  </VStack>
                </Center>
              </Stack>
            )
          }
        </For>
      </SimpleGrid>
    </TokenDoc>
  );
}

/** Show the configured radii as native square specimens. */
export function TokensRadius(): JSX.Element {
  const names = tokenDocEntries('radii').map((token) => token.extensions.prop);
  return (
    <TokenDoc title="theme.tokens.radii" mt="8">
      <SimpleGrid minChildWidth="120px" style={{ gap: 'var(--lui-spacing-4)' }}>
        <For each={names}>
          {
            /** Render the shape and label for one radius. */
            (radius) => (
              <Stack style={{ flex: '1' }}>
                <Square
                  size="20"
                  style={{
                    'border-radius': `var(--lui-radii-${radius})`,
                    background: 'var(--lui-colors-bg-subtle)',
                    color: 'var(--lui-colors-fg-muted)',
                    'border-width': '1px',
                  }}
                />
                <Box style={{ 'line-height': '1' }}>{radius}</Box>
                <Box
                  as="pre"
                  style={{
                    color: 'var(--lui-colors-fg-subtle)',
                    'font-size': 'var(--lui-font-sizes-xs)',
                  }}
                >
                  {tokens.getByName(`radii.${radius}`)?.originalValue}
                </Box>
              </Stack>
            )
          }
        </For>
      </SimpleGrid>
    </TokenDoc>
  );
}

/** Scale breakpoint bars and labels in ascending media-query order. */
export function TokensBreakpoints(): JSX.Element {
  const breakpoints = Object.fromEntries(
    tokenDocEntries('breakpoints').map((token) => [token.extensions.prop, token.value]),
  );
  const names = Object.entries(breakpoints)
    .sort(
      /** Put narrower breakpoint values first. */
      (first, second) => parseFloat(first[1]) - parseFloat(second[1]),
    )
    .map(
      /** Retain only the configured breakpoint name. */
      ([name]) => name,
    );
  return (
    <TokenDoc title="theme.breakpoints" mt="8">
      <Stack gap="8">
        <For each={names}>
          {
            /** Scale a bar to this breakpoint's ordered position. */
            (name, index) => (
              <HStack>
                <Box style={{ 'min-width': '200px' }}>
                  <Box
                    style={{
                      'border-radius': 'var(--lui-radii-sm)',
                      height: 'var(--lui-sizes-12)',
                      'border-inline-width': '4px',
                      'border-top-width': '4px',
                      'border-bottom-width': '12px',
                      width: `${(index() + 1) * 2}rem`,
                    }}
                  />
                </Box>
                <Box style={{ 'min-width': '80px' }}>
                  <Text
                    style={{
                      'padding-block': 'var(--lui-spacing-2)',
                      'font-weight': 'var(--lui-font-weights-medium)',
                    }}
                  >
                    {name}
                  </Text>
                </Box>
                <Text
                  style={{ 'padding-block': 'var(--lui-spacing-2)', opacity: '0.6' }}
                >{`@media screen (min-width >= ${breakpoints[name]})`}</Text>
              </HStack>
            )
          }
        </For>
      </Stack>
    </TokenDoc>
  );
}

/** Animate a square with each configured easing curve. */
export function TokensEasings(): JSX.Element {
  const easings = tokenDocEntries('easings');
  return (
    <TokenDoc title="theme.tokens.easings" mt="8">
      <SimpleGrid
        columns={2}
        style={{ gap: 'var(--lui-spacing-8)', 'font-size': 'var(--lui-font-sizes-sm)' }}
      >
        <For each={easings}>
          {
            /** Animate a specimen using this easing value. */
            (token) => (
              <Stack>
                <Box
                  style={{
                    width: '200px',
                    height: '200px',
                    background: 'var(--lui-colors-pink-200)',
                    'animation-name': 'slide-to-right-full',
                    'animation-timing-function': easingValue(token.value),
                    'animation-duration': '1s',
                    'animation-iteration-count': 'infinite',
                    'animation-direction': 'alternate',
                  }}
                />
                <Text style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>
                  {token.name}
                </Text>
              </Stack>
            )
          }
        </For>
      </SimpleGrid>
    </TokenDoc>
  );
}
