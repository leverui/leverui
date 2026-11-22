import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CheckIcon, PlusIcon, TypeIcon } from '@lucide/solid';
import { Button, ColorPicker, HStack, IconButton, Portal, VStack } from '../../src';

/** Let consumers add the current color to a persistent swatch list. */
export function ColorPickerSaveSwatch(): JSX.Element {
  const [color, setColor] = createSignal(ColorPicker.parseColor('#000'));
  const [view, setView] = createSignal<'picker' | 'swatch'>('swatch');
  const [swatches, setSwatches] = createSignal(['#FF0000', '#00FF00', '#0000FF', '#FFFF00']);

  /** Track live color edits so Save Swatch captures the current value. */
  function updateColor(details: ColorPicker.ValueChangeDetails): void {
    setColor(details.value);
  }

  /** Append the selected color and return to the palette view. */
  function saveSwatch(): void {
    setSwatches(
      /** Preserve existing choices when adding the current color. */
      (previous) => [...previous, color().toString('css')],
    );
    setView('swatch');
  }

  /** Reveal the full color editor for a custom swatch. */
  function showPicker(): void {
    setView('picker');
  }

  return (
    <ColorPicker.Root
      defaultValue={color()}
      onValueChange={updateColor}
      class="color-picker-example-compact"
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Control>
        <ColorPicker.Trigger data-fit-content>
          <VStack gap="1">
            <TypeIcon class="color-picker-example-type-icon" />
            <ColorPicker.ValueSwatch class="color-picker-example-swatch-short" />
          </VStack>
        </ColorPicker.Trigger>
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <Show when={view() === 'picker'}>
              <ColorPicker.Area />
              <HStack>
                <ColorPicker.EyeDropper size="sm" variant="outline" />
                <ColorPicker.Sliders />
              </HStack>
              <Button onClick={saveSwatch}>Save swatch</Button>
            </Show>
            <Show when={view() === 'swatch'}>
              <ColorPicker.SwatchGroup>
                <For each={swatches()}>
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
                <IconButton
                  variant="outline"
                  size="xs"
                  aria-label="Add a swatch"
                  onClick={showPicker}
                >
                  <PlusIcon />
                </IconButton>
              </ColorPicker.SwatchGroup>
            </Show>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}
