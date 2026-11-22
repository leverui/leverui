import { type JSX } from '@solidjs/web';
import { ColorPicker, HStack, Portal } from '../../src';

/** Show the input, trigger, area, and sliders. */
export function ColorPickerBasic(): JSX.Element {
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
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}

/** Keep both field and trigger inert under the disabled policy. */
export function ColorPickerDisabled(): JSX.Element {
  return (
    <ColorPicker.Root
      disabled
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
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}

/** Preserve focus and display while blocking color edits. */
export function ColorPickerReadonly(): JSX.Element {
  return (
    <ColorPicker.Root
      readOnly
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
              <ColorPicker.EyeDropper size="sm" variant="outline" />
              <ColorPicker.Sliders />
            </HStack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}

/** Let only the value swatch determine the trigger's size. */
export function ColorPickerFitContent(): JSX.Element {
  return (
    <ColorPicker.Root
      defaultValue={ColorPicker.parseColor('#eb5e41')}
      class="color-picker-example-compact"
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Label>Color</ColorPicker.Label>
      <ColorPicker.Control>
        <ColorPicker.Input />
        <ColorPicker.Trigger data-fit-content class="color-picker-example-trigger-round">
          <ColorPicker.ValueSwatch class="color-picker-example-radius-inherit" />
        </ColorPicker.Trigger>
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
