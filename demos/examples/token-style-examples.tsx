import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Center, HStack, Stack, Text } from '../../src';
import './token-style-examples.css';

const animationNames = [
  'slide-fade-in',
  'slide-fade-out',
  'scale-fade-in',
  'scale-fade-out',
] as const;

/** Switch the specimen among the four animation styles. */
export function TokensAnimationStyle(): JSX.Element {
  const [animation, setAnimation] = createSignal<string>();
  /** Apply the selected animation style to the specimen. */
  function selectAnimation(name: string): void {
    setAnimation(name);
  }
  /** Reset the specimen when the selected animation completes. */
  function clearAnimation(): void {
    setAnimation(undefined);
  }
  return (
    <Stack gap="8" align="flex-start" style={{ 'margin-bottom': 'var(--leverui-spacing-8)' }}>
      <HStack wrap="wrap">
        <For each={animationNames}>
          {
            /** Render a selector for one animation style token. */
            (name) => (
              <Button
                size="sm"
                variant="outline"
                onClick={
                  /** Bind the selected token to this button. */
                  () => selectAnimation(name)
                }
              >
                {name}
              </Button>
            )
          }
        </For>
      </HStack>
      <Center
        class="token-style-animation"
        data-animation-style={animation()}
        onAnimationEnd={clearAnimation}
        data-placement="bottom"
      >
        Animation
      </Center>
    </Stack>
  );
}

/** Display the three always-visible focus ring placements. */
export function TokensFocusRing(): JSX.Element {
  return (
    <Stack gap="4">
      <For each={['inside', 'outside', 'mixed'] as const}>
        {
          /** Display one focus-ring placement with its focus state set. */
          (focusRing) => (
            <Center class="token-style-focus" data-focus-ring={focusRing} data-focus>
              {focusRing}
            </Center>
          )
        }
      </For>
    </Stack>
  );
}

const layerStyleGroups = [
  ['Fill', ['fill.muted', 'fill.subtle', 'fill.surface', 'fill.solid']],
  ['Outline', ['outline.subtle', 'outline.solid']],
  ['Indicator', ['indicator.top', 'indicator.bottom', 'indicator.start', 'indicator.end']],
] as const;

/** Present fill, outline, and indicator layer styles in matching groups. */
export function TokensLayerStyle(): JSX.Element {
  return (
    <Stack
      gap="20"
      style={{
        'margin-top': 'var(--leverui-spacing-10)',
        'margin-bottom': 'var(--leverui-spacing-20)',
      }}
    >
      <For each={layerStyleGroups}>
        {
          /** Group a family of layer styles under its label. */
          ([title, styles]) => (
            <Stack gap="4">
              <Text
                style={{
                  'font-weight': 'var(--leverui-font-weights-medium)',
                  color: 'var(--leverui-colors-fg-muted)',
                }}
              >
                layerStyle: {title.toLowerCase()}.*
              </Text>
              <HStack wrap="wrap" gap="10">
                <For each={styles}>
                  {
                    /** Render one layered surface sample. */
                    (layerStyle) => (
                      <Center
                        class="token-style-layer"
                        data-leverui-color-palette="teal"
                        data-layer-style={layerStyle}
                      >
                        {layerStyle}
                      </Center>
                    )
                  }
                </For>
              </HStack>
            </Stack>
          )
        }
      </For>
    </Stack>
  );
}

const textStyleNames = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
] as const;
const textStyleLineHeights: Record<(typeof textStyleNames)[number], string> = {
  xs: '1rem',
  sm: '1.25rem',
  md: '1.5rem',
  lg: '1.75rem',
  xl: '1.875rem',
  '2xl': '2rem',
  '3xl': '2.375rem',
  '4xl': '2.75rem',
  '5xl': '3.75rem',
  '6xl': '4.5rem',
  '7xl': '5.75rem',
};

/** Show every text style with the requested visible brand substitution. */
export function TokensTextStyles(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={textStyleNames}>
        {
          /** Pair a text-style label with its font sample. */
          (textStyle) => (
            <Stack>
              <Text
                textStyle="sm"
                style={{
                  'font-weight': 'var(--leverui-font-weights-medium)',
                  color: 'var(--leverui-colors-fg-muted)',
                }}
              >
                textStyle: {textStyle}
              </Text>
              <Text
                style={{
                  'font-size': `var(--leverui-font-sizes-${textStyle})`,
                  'line-height': textStyleLineHeights[textStyle],
                  'letter-spacing': ['4xl', '5xl', '6xl', '7xl'].includes(textStyle)
                    ? '-0.025em'
                    : undefined,
                }}
              >
                Lever UI
              </Text>
            </Stack>
          )
        }
      </For>
    </Stack>
  );
}
