import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Code, ColorPicker, HStack, Portal, Stack } from '../../src';

/** Report a color only after the pointer or channel edit commits. */
export function ColorPickerChangeEnd(): JSX.Element {
  const [value, setValue] = createSignal(ColorPicker.parseColor('#eb5e41'));

  /** Keep the last committed color in the visible code label. */
  function recordEnd(details: ColorPicker.ValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <Stack gap="8" align="flex-start">
      <Code>
        onChangeEnd: <b>{value().toString('hex')}</b>
      </Code>
      <ColorPicker.Root
        defaultValue={ColorPicker.parseColor('#eb5e41')}
        onValueChangeEnd={recordEnd}
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
            </ColorPicker.Content>
          </ColorPicker.Positioner>
        </Portal>
      </ColorPicker.Root>
    </Stack>
  );
}

/** Keep the current color in caller-owned Solid state. */
export function ColorPickerControlled(): JSX.Element {
  const [color, setColor] = createSignal(ColorPicker.parseColor('#eb5e41'));

  /** Synchronize the external signal with the machine's next color. */
  function updateColor(details: ColorPicker.ValueChangeDetails): void {
    setColor(details.value);
  }

  return (
    <ColorPicker.Root
      value={color()}
      format="hsla"
      onValueChange={updateColor}
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
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}

/** Control the picker from a caller-owned store. */
export function ColorPickerWithStore(): JSX.Element {
  const colorPicker = ColorPicker.useColorPicker({
    defaultValue: ColorPicker.parseColor('#eb5e41'),
  });

  return (
    <ColorPicker.RootProvider value={colorPicker} class="color-picker-example-compact">
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
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.RootProvider>
  );
}
