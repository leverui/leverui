import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CheckIcon } from '@lucide/solid';
import { ColorPicker, HStack, Portal, Stack } from '../../src';

const swatches = ['red', 'blue', 'green'];

/** Present the full seven-size picker range. */
export function ColorPickerSizes(): JSX.Element {
  return (
    <Stack gap="8" style={{ 'max-width': 'var(--lui-sizes-sm)' }}>
      <For each={['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const}>
        {
          /** Render the same color controls at each supported size. */
          (size) => (
            <ColorPicker.Root defaultValue={ColorPicker.parseColor('#eb5e41')} size={size}>
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>{`Color (${size})`}</ColorPicker.Label>
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
                    <ColorPicker.SwatchGroup>
                      <For each={swatches}>
                        {
                          /** Bind each chip to a real color-picker swatch trigger. */
                          (color) => (
                            <ColorPicker.SwatchTrigger value={color}>
                              <ColorPicker.Swatch
                                value={color}
                                class="color-picker-example-swatch-compact"
                              >
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
          )
        }
      </For>
    </Stack>
  );
}

/** Compare the outline and subtle picker control variants. */
export function ColorPickerVariants(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['outline', 'subtle'] as const}>
        {
          /** Render the control anatomy for each variant. */
          (variant) => (
            <ColorPicker.Root
              defaultValue={ColorPicker.parseColor('#eb5e41')}
              class="color-picker-example-compact"
              variant={variant}
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>{`Color (${variant})`}</ColorPicker.Label>
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
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </Portal>
            </ColorPicker.Root>
          )
        }
      </For>
    </Stack>
  );
}
