import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CheckIcon, PlusIcon } from '@lucide/solid';
import { ColorPicker, HStack, Portal, Square } from '../../src';

const swatches = ['red', 'blue', 'green'];

/** Keep the color controls visible without a popup trigger. */
export function ColorPickerInline(): JSX.Element {
  return (
    <ColorPicker.Root open defaultValue={ColorPicker.parseColor('#000')}>
      <ColorPicker.HiddenInput />
      <ColorPicker.Content class="color-picker-example-inline-content">
        <ColorPicker.Area />
        <HStack>
          <ColorPicker.EyeDropper size="xs" variant="outline" />
          <ColorPicker.Sliders />
          <ColorPicker.ValueSwatch />
        </HStack>
      </ColorPicker.Content>
    </ColorPicker.Root>
  );
}

/** Select a named color directly from the swatch row. */
export function ColorPickerSwatchOnly(): JSX.Element {
  const colors = ['red', 'green', 'blue', 'purple', 'orange', 'pink'];
  return (
    <ColorPicker.Root class="color-picker-example-align-start">
      <ColorPicker.HiddenInput />
      <ColorPicker.Label>
        Color: <ColorPicker.ValueText />
      </ColorPicker.Label>
      <ColorPicker.SwatchGroup>
        <For each={colors}>
          {
            /** Render each named color as an accessible picker choice. */
            (color) => (
              <ColorPicker.SwatchTrigger value={color}>
                <ColorPicker.Swatch value={color}>
                  <ColorPicker.SwatchIndicator class="color-picker-example-swatch-indicator" />
                </ColorPicker.Swatch>
              </ColorPicker.SwatchTrigger>
            )
          }
        </For>
      </ColorPicker.SwatchGroup>
    </ColorPicker.Root>
  );
}

/** Open the standard popup from a swatch and value label. */
export function ColorPickerTriggerOnly(): JSX.Element {
  return (
    <ColorPicker.Root
      defaultValue={ColorPicker.parseColor('#eb5e41')}
      class="color-picker-example-compact"
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Label>Color</ColorPicker.Label>
      <ColorPicker.Control>
        <ColorPicker.Trigger class="color-picker-example-trigger-padded">
          <ColorPicker.ValueSwatch class="color-picker-example-swatch-large" />
          <ColorPicker.ValueText class="color-picker-example-value-wide" />
        </ColorPicker.Trigger>
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.Area />
            <HStack>
              <ColorPicker.EyeDropper size="sm" variant="outline" />
              <ColorPicker.Sliders />
              <ColorPicker.ValueSwatch />
            </HStack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}

/** Combine three quick swatches with a hex channel field in the popup. */
export function ColorPickerSwatchAndInput(): JSX.Element {
  return (
    <ColorPicker.Root
      size="xs"
      defaultValue={ColorPicker.parseColor('#eb5e41')}
      class="color-picker-example-compact"
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Control>
        <ColorPicker.Trigger />
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.SwatchGroup>
              <For each={swatches}>
                {
                  /** Bind each chip to a real color-picker swatch trigger. */
                  (color) => (
                    <ColorPicker.SwatchTrigger value={color}>
                      <ColorPicker.Swatch value={color}>
                        <ColorPicker.SwatchIndicator>
                          <CheckIcon />
                        </ColorPicker.SwatchIndicator>
                      </ColorPicker.Swatch>
                    </ColorPicker.SwatchTrigger>
                  )
                }
              </For>
            </ColorPicker.SwatchGroup>
            <ColorPicker.ChannelInput channel="hex" />
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}

/** Put quick swatches and the custom-color trigger in one control. */
export function ColorPickerSwatchesAndTrigger(): JSX.Element {
  return (
    <ColorPicker.Root
      defaultValue={ColorPicker.parseColor('#eb5e41')}
      class="color-picker-example-compact"
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Label>
        Color: <ColorPicker.ValueText />
      </ColorPicker.Label>
      <ColorPicker.Control>
        <ColorPicker.SwatchGroup>
          <For each={swatches}>
            {
              /** Bind each chip to a real color-picker swatch trigger. */
              (color) => (
                <ColorPicker.SwatchTrigger value={color}>
                  <ColorPicker.Swatch value={color}>
                    <ColorPicker.SwatchIndicator>
                      <CheckIcon />
                    </ColorPicker.SwatchIndicator>
                  </ColorPicker.Swatch>
                </ColorPicker.SwatchTrigger>
              )
            }
          </For>
          <ColorPicker.Trigger class="color-picker-example-trigger-large">
            <Square
              size="7"
              style={{
                'background-size': 'cover',
                overflow: 'hidden',
                border: '4px solid',
                'border-image':
                  'conic-gradient(from 90deg, red, yellow, lime, aqua, blue, magenta, red) 1',
              }}
            >
              <PlusIcon />
            </Square>
          </ColorPicker.Trigger>
        </ColorPicker.SwatchGroup>
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.Area />
            <HStack>
              <ColorPicker.EyeDropper size="xs" variant="outline" />
              <ColorPicker.Sliders />
            </HStack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}
