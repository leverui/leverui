import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Center, SimpleGrid, Stack, Text, VStack } from '../../src';
import { TokenDoc } from './token-doc-frame';
import { tokenDocEntries, type TokenDocEntry } from './token-doc-css';

const colors = tokenDocEntries('colors');
const palettes = [
  'gray',
  'red',
  'pink',
  'purple',
  'cyan',
  'blue',
  'teal',
  'green',
  'yellow',
  'orange',
];
type ColorVariant = 'background' | 'border' | 'text';

/** Render a color token's swatch and its raw or conditional values. */
function ColorGridItem(props: { token: TokenDocEntry; variant: ColorVariant }): JSX.Element {
  /** Read the token's CSS variable reference. */
  const value = () => props.token.extensions.cssVar?.ref;
  /** Read the token's conditional aliases, if any. */
  const conditions = () => props.token.extensions.conditions;
  /** Choose the swatch background for the current variant. */
  const background = () =>
    props.variant === 'text' && props.token.name.includes('inverted')
      ? 'bg.inverted'
      : props.variant === 'background'
        ? value()
        : undefined;
  return (
    <VStack style={{ flex: '1' }}>
      <Center
        style={{
          'border-width': '1px',
          'border-radius': 'var(--leverui-radii-lg)',
          width: '100%',
          height: 'var(--leverui-sizes-20)',
          background:
            background() === 'bg.inverted' ? 'var(--leverui-colors-bg-inverted)' : background(),
          color: props.variant === 'text' ? value() : undefined,
          'border-color': props.variant === 'border' ? value() : undefined,
        }}
      >
        {props.variant === 'text' && (
          <Text style={{ 'font-size': 'var(--leverui-font-sizes-lg)' }}>Ag</Text>
        )}
      </Center>
      <Text textStyle="xs">{props.token.name.replace('colors.', '')}</Text>
      {conditions() ? (
        <Stack style={{ 'margin-top': 'var(--leverui-spacing-1)' }}>
          <For each={Object.entries(conditions() ?? {})}>
            {
              /** Label one color alias's condition and referenced value. */
              ([name, token]) => (
                <Text
                  style={{
                    'font-size': 'var(--leverui-font-sizes-xs)',
                    'margin-top': 'calc(-1 * var(--leverui-spacing-1))',
                    color: 'var(--leverui-colors-fg-muted)',
                  }}
                >
                  {name.replace('_', '')}: {String(token).replace('colors.', '')}
                </Text>
              )
            }
          </For>
        </Stack>
      ) : (
        <Text
          style={{
            'font-size': 'var(--leverui-font-sizes-xs)',
            'margin-top': 'calc(-1 * var(--leverui-spacing-1))',
            color: 'var(--leverui-colors-fg-muted)',
          }}
        >
          {props.token.originalValue}
        </Text>
      )}
    </VStack>
  );
}

/** Lay out a color family as default-sized swatch cards. */
function ColorGrid(props: { tokens: TokenDocEntry[]; variant?: ColorVariant }): JSX.Element {
  return (
    <SimpleGrid minChildWidth="120px" style={{ gap: 'var(--leverui-spacing-4)' }}>
      <For each={props.tokens}>
        {
          /** Render one swatch from the selected color family. */
          (token) => <ColorGridItem token={token} variant={props.variant ?? 'background'} />
        }
      </For>
    </SimpleGrid>
  );
}

/** Display the ten raw color palettes without semantic aliases. */
export function TokensColors(): JSX.Element {
  return (
    <Stack gap="8" style={{ 'margin-block': 'var(--leverui-spacing-8)' }}>
      <For each={palettes}>
        {
          /** Place a raw palette in its own framed section. */
          (palette) => (
            <TokenDoc title={palette}>
              <ColorGrid
                tokens={colors.filter(
                  /** Select raw swatches from this exact palette. */
                  (token) =>
                    token.name.startsWith(`colors.${palette}.`) && !token.extensions.conditions,
                )}
              />
            </TokenDoc>
          )
        }
      </For>
    </Stack>
  );
}

/** Display background, border, text, and palette semantic colors. */
export function TokensSemanticColors(): JSX.Element {
  return (
    <Stack gap="8" style={{ 'margin-block': 'var(--leverui-spacing-8)' }}>
      <TokenDoc title="background">
        <ColorGrid
          tokens={colors.filter(
            /** Select semantic background colors. */
            (token) => token.name.startsWith('colors.bg'),
          )}
        />
      </TokenDoc>
      <TokenDoc title="border">
        <ColorGrid
          variant="border"
          tokens={colors.filter(
            /** Select semantic border colors. */
            (token) => token.name.startsWith('colors.border'),
          )}
        />
      </TokenDoc>
      <TokenDoc title="text">
        <ColorGrid
          variant="text"
          tokens={colors.filter(
            /** Select semantic foreground colors. */
            (token) => token.name.startsWith('colors.fg'),
          )}
        />
      </TokenDoc>
      <For each={palettes}>
        {
          /** Place one palette's semantic aliases in its own section. */
          (palette) => (
            <TokenDoc title={palette}>
              <ColorGrid
                tokens={colors.filter(
                  /** Keep semantic aliases separate from the raw color scale. */
                  (token) =>
                    token.name.startsWith(`colors.${palette}.`) &&
                    Boolean(token.extensions.conditions),
                )}
              />
            </TokenDoc>
          )
        }
      </For>
    </Stack>
  );
}
