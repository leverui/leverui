import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, ButtonGroup, HStack, Stack, Text } from '../../src';
import { colorPalettes } from './playground-matrix';
import './button-examples.css';

/** Show the five Button sizes used on the guide. */
export function ButtonSizeTable(): JSX.Element {
  return (
    <HStack wrap="wrap" gap="6">
      <Button size="xs">Button (xs)</Button>
      <Button size="sm">Button (sm)</Button>
      <Button size="md">Button (md)</Button>
      <Button size="lg">Button (lg)</Button>
      <Button size="xl">Button (xl)</Button>
    </HStack>
  );
}

/** Show the six Button treatments used on the guide. */
export function ButtonVariantTable(): JSX.Element {
  return (
    <HStack wrap="wrap" gap="6">
      <Button variant="solid">Solid</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="surface">Surface</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="plain">Plain</Button>
    </HStack>
  );
}

/** Compare solid, outline, surface, and subtle buttons across color palettes. */
export function ButtonWithColors(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={colorPalettes}>
        {(palette) => (
          <Stack align="center" direction="row" gap="10">
            <Text style={{ 'min-width': '8ch' }}>{palette}</Text>
            <Button colorPalette={palette}>Button</Button>
            <Button colorPalette={palette} variant="outline">
              Button
            </Button>
            <Button colorPalette={palette} variant="surface">
              Button
            </Button>
            <Button colorPalette={palette} variant="subtle">
              Button
            </Button>
          </Stack>
        )}
      </For>
    </Stack>
  );
}

/** Compare semantic and core border-radius tokens on subtle Buttons. */
export function ButtonWithRadius(): JSX.Element {
  return (
    <Stack gap="8">
      <Stack>
        <Text textStyle="sm">Semantic radius</Text>
        <ButtonGroup variant="subtle">
          <Button class="example-button-radius-l1">Rounded l1</Button>
          <Button class="example-button-radius-l2">Rounded l2</Button>
          <Button class="example-button-radius-l3">Rounded l3</Button>
        </ButtonGroup>
      </Stack>
      <Stack>
        <Text textStyle="sm">Core radius</Text>
        <ButtonGroup variant="subtle">
          <For each={['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const}>
            {(radius) => (
              <Button class={`example-button-radius-${radius}`}>Rounded {radius}</Button>
            )}
          </For>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
}

/** Increase Button size at the medium breakpoint. */
export function ButtonWithResponsiveSize(): JSX.Element {
  return (
    <Button class="example-button-pill" size={{ base: 'md', md: 'lg' }}>
      Button
    </Button>
  );
}

/** Override one Button's dimensions and green outline. */
export function ButtonWithStyleOverride(): JSX.Element {
  return (
    <Button
      size="md"
      style={{
        height: '48px',
        width: '200px',
        border: '2px solid var(--leverui-colors-green-500)',
      }}
    >
      Button
    </Button>
  );
}
