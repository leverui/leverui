import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, HStack, Stack, Text } from '../../src';
import { TokenDoc } from './token-doc-frame';
import { tokenDocEntries, tokenDocEntry } from './token-doc-css';

const tokens = { getByName: tokenDocEntry };

/** Show each configured font family with its specimen and source value. */
export function TokensFont(): JSX.Element {
  return (
    <TokenDoc title="theme.tokens.fonts" mt="8">
      <Stack gap="8">
        <For each={tokenDocEntries('fonts').map((token) => token.extensions.prop)}>
          {
            /** Display the glyph and source stack for one font family. */
            (font) => (
              <Stack style={{ flex: '1' }}>
                <Text
                  style={{
                    'font-family': `var(--lui-fonts-${font})`,
                    'font-size': 'var(--lui-font-sizes-3xl)',
                  }}
                >
                  Ag
                </Text>
                <Box>{font}</Box>
                <Box
                  as="pre"
                  style={{
                    'text-wrap': 'balance',
                    color: 'var(--lui-colors-fg-muted)',
                    'font-size': 'var(--lui-font-sizes-xs)',
                  }}
                >
                  {tokens.getByName(`fonts.${font}`)?.originalValue}
                </Box>
              </Stack>
            )
          }
        </For>
      </Stack>
    </TokenDoc>
  );
}

/** Pair each font-size token value with a rendered glyph sample. */
export function TokensFontSizes(): JSX.Element {
  return (
    <TokenDoc title="theme.tokens.fontSizes" mt="8">
      <Stack gap="4">
        <For each={tokenDocEntries('fontSizes').map((token) => token.extensions.prop)}>
          {
            /** Pair one font-size token with a live glyph. */
            (name) => {
              const token = tokens.getByName(`fontSizes.${name}`);
              return (
                <Stack direction="row" align="center">
                  <Text style={{ width: '4rem' }}>{token?.extensions.prop}</Text>
                  <Text style={{ width: '6rem', color: 'var(--lui-colors-fg-muted)' }}>
                    {token?.value}
                  </Text>
                  <Text style={{ 'font-size': token?.value?.toString() }}>Ag</Text>
                </Stack>
              );
            }
          }
        </For>
      </Stack>
    </TokenDoc>
  );
}

/** Pair each weight token with a large glyph at that weight. */
export function TokensFontWeights(): JSX.Element {
  return (
    <TokenDoc title="theme.tokens.fontWeights" mt="8">
      <Stack gap="4">
        <For each={tokenDocEntries('fontWeights').map((token) => token.extensions.prop)}>
          {
            /** Pair one weight token with a live glyph. */
            (name) => {
              const token = tokens.getByName(`fontWeights.${name}`);
              return (
                <Stack direction="row" align="center">
                  <Text style={{ width: '6rem' }}>{token?.extensions.prop}</Text>
                  <Text style={{ width: '6rem', color: 'var(--lui-colors-fg-muted)' }}>
                    {token?.value}
                  </Text>
                  <Text
                    style={{
                      'font-weight': token?.value,
                      'font-size': 'var(--lui-font-sizes-2xl)',
                    }}
                  >
                    Ag
                  </Text>
                </Stack>
              );
            }
          }
        </For>
      </Stack>
    </TokenDoc>
  );
}

/** Show line-height tokens against the paragraph. */
export function TokensLineHeights(): JSX.Element {
  return (
    <TokenDoc title="theme.tokens.lineHeights" mt="8">
      <Stack gap="8">
        <For each={tokenDocEntries('lineHeights').map((token) => token.extensions.prop)}>
          {
            /** Show one line-height value against the paragraph. */
            (name) => {
              const token = tokens.getByName(`lineHeights.${name}`);
              return (
                <Stack>
                  <HStack style={{ color: 'var(--lui-colors-fg-muted)' }}>
                    <Text>
                      {token?.extensions.prop} / {token?.value}
                    </Text>
                  </HStack>
                  <Text
                    style={{
                      'line-height': token?.value,
                      'font-size': 'var(--lui-font-sizes-2xl)',
                    }}
                  >
                    The Lanternwright Chronicles is a fantasy novel series about a city that
                    rearranges its streets every night. It follows Wren Ashford, an apprentice
                    lamplighter who maps the changes before dawn and dreams of becoming keeper of
                    the great lantern.
                  </Text>
                </Stack>
              );
            }
          }
        </For>
      </Stack>
    </TokenDoc>
  );
}

/** Show letter-spacing tokens against the same short text sample. */
export function TokensLetterSpacings(): JSX.Element {
  return (
    <TokenDoc title="theme.tokens.letterSpacings" mt="8">
      <Stack gap="4">
        <For each={tokenDocEntries('letterSpacings').map((token) => token.extensions.prop)}>
          {
            /** Show one tracking value against the label. */
            (name) => {
              const token = tokens.getByName(`letterSpacings.${name}`);
              return (
                <Stack>
                  <Text style={{ color: 'var(--lui-colors-fg-muted)' }}>
                    {token?.extensions.prop} / {token?.value}
                  </Text>
                  <Text
                    style={{
                      'letter-spacing': token?.value?.toString(),
                      'font-size': 'var(--lui-font-sizes-2xl)',
                    }}
                  >
                    Wren Ashford
                  </Text>
                </Stack>
              );
            }
          }
        </For>
      </Stack>
    </TokenDoc>
  );
}
