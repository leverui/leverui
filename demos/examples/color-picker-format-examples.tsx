import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CheckIcon } from '@lucide/solid';
import { ColorPicker, HStack, Portal } from '../../src';

/** Start the picker in HSLA format. */
export function ColorPickerFormat(): JSX.Element {
  return (
    <ColorPicker.Root
      defaultValue={ColorPicker.parseColor('#eb5e41')}
      class="color-picker-example-compact"
      format="hsla"
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Label>Color</ColorPicker.Label>
      <ColorPicker.Control>
        <ColorPicker.Input />
        <ColorPicker.Trigger />
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.Area />
            <HStack>
              <ColorPicker.EyeDropper size="sm" variant="outline" />
              <ColorPicker.Sliders />
            </HStack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}

const swatches = [
  '#000000',
  '#4A5568',
  '#F56565',
  '#ED64A6',
  '#9F7AEA',
  '#6B46C1',
  '#4299E1',
  '#0BC5EA',
  '#00B5D8',
  '#38B2AC',
  '#48BB78',
  '#68D391',
  '#ECC94B',
  '#DD6B20',
];

/** Add the fourteen colors to the standard picker. */
export function ColorPickerSwatches(): JSX.Element {
  return (
    <ColorPicker.Root
      defaultValue={ColorPicker.parseColor('#eb5e41')}
      class="color-picker-example-compact"
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Label>Color</ColorPicker.Label>
      <ColorPicker.Control>
        <ColorPicker.Input />
        <ColorPicker.Trigger />
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.Area />
            <HStack>
              <ColorPicker.EyeDropper size="xs" variant="outline" />
              <ColorPicker.Sliders />
            </HStack>
            <ColorPicker.SwatchGroup>
              <For each={swatches}>
                {
                  /** Bind each chip to a real color-picker swatch trigger. */
                  (color) => (
                    <ColorPicker.SwatchTrigger value={color}>
                      <ColorPicker.Swatch value={color} class="color-picker-example-swatch-compact">
                        <ColorPicker.SwatchIndicator>
                          <CheckIcon />
                        </ColorPicker.SwatchIndicator>
                      </ColorPicker.Swatch>
                    </ColorPicker.SwatchTrigger>
                  )
                }
              </For>
            </ColorPicker.SwatchGroup>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}
