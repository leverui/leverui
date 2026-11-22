import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Badge, ColorSwatch, ColorSwatchMix, Group, HStack } from '../../src';

const palette = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
const alphaColors = [
  'rgba(255, 0, 0, 0.5)',
  'rgba(0, 0, 255, 0.7)',
  'rgba(0, 255, 0, 0.4)',
  'rgba(255, 192, 203, 0.6)',
];
const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

/** Display the single lime color sample. */
export function ColorSwatchBasic(): JSX.Element {
  return <ColorSwatch value="#bada55" />;
}

/** Show two, three, and four color mixtures. */
export function ColorSwatchMixed(): JSX.Element {
  return (
    <HStack>
      <ColorSwatchMix size="lg" items={['red', 'pink']} />
      <ColorSwatchMix size="lg" items={['red', 'pink', 'green']} />
      <ColorSwatchMix size="lg" items={['lightgreen', 'green', 'darkgreen', 'black']} />
    </HStack>
  );
}

/** Show five attached primary and secondary color samples. */
export function ColorSwatchPalette(): JSX.Element {
  return (
    <Group attached grow style={{ width: '100%', 'max-width': '24rem' }}>
      <For each={palette}>
        {
          /** Render each palette color in order. */ (color) => (
            <ColorSwatch value={color} size="2xl" />
          )
        }
      </For>
    </Group>
  );
}

/** Show how partial alpha reveals the checkerboard. */
export function ColorSwatchWithAlpha(): JSX.Element {
  return (
    <HStack>
      <For each={alphaColors}>
        {
          /** Preserve each RGBA value so opacity remains visible. */ (color) => (
            <ColorSwatch value={color} size="xl" />
          )
        }
      </For>
    </HStack>
  );
}

/** Pair a swatch with the hexadecimal badge label. */
export function ColorSwatchWithBadge(): JSX.Element {
  return (
    <Badge>
      <ColorSwatch value="#bada55" style={{ '--leverui-swatch-size': '0.82em' }} />
      #bada55
    </Badge>
  );
}

/** Show every documented swatch size in order. */
export function ColorSwatchWithSizes(): JSX.Element {
  return (
    <HStack>
      <For each={sizes}>
        {
          /** Bind each size to its own swatch. */ (size) => (
            <ColorSwatch value="#bada55" size={size} />
          )
        }
      </For>
    </HStack>
  );
}

/** Show a fully transparent swatch over its checkerboard. */
export function ColorSwatchWithTransparent(): JSX.Element {
  return <ColorSwatch value="rgba(0, 0, 0, 0)" />;
}
