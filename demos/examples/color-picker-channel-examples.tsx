import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ColorPicker, HStack, InputGroup, Portal, Stack } from '../../src';

/** Show each channel's label and slider in one color format. */
function ChannelSliders(props: { format: 'rgba' | 'hsla' | 'hsba' }): JSX.Element {
  return (
    <ColorPicker.View format={props.format}>
      <For each={ColorPicker.getColorChannels(props.format)}>
        {
          /** Pair the channel's name with its editable slider. */
          (channel) => (
            <Stack gap="1">
              <ColorPicker.ChannelText class="color-picker-example-channel-label">
                {channel}
              </ColorPicker.ChannelText>
              <ColorPicker.ChannelSlider channel={channel} />
            </Stack>
          )
        }
      </For>
    </ColorPicker.View>
  );
}

/** Replace the area with all three color channel slider views. */
export function ColorPickerChannelSliderOnly(): JSX.Element {
  return (
    <ColorPicker.Root
      defaultValue={ColorPicker.parseColor('#eb5e41')}
      class="color-picker-example-compact"
    >
      <ColorPicker.Control>
        <ColorPicker.Trigger />
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.FormatSelect />
            <ChannelSliders format="hsla" />
            <ChannelSliders format="hsba" />
            <ChannelSliders format="rgba" />
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}

/** Show one numeric input and channel label per format channel. */
function ChannelInputs(props: { format: 'rgba' | 'hsla' | 'hsba' }): JSX.Element {
  return (
    <ColorPicker.View format={props.format}>
      <For each={ColorPicker.getColorChannels(props.format)}>
        {
          /** Keep the native input aligned above its one-letter label. */
          (channel) => (
            <Stack gap="1" align="center" style={{ flex: '1' }}>
              <ColorPicker.ChannelInput
                channel={channel}
                class="color-picker-example-channel-input"
              />
              <ColorPicker.ChannelText>{channel.charAt(0).toUpperCase()}</ColorPicker.ChannelText>
            </Stack>
          )
        }
      </For>
    </ColorPicker.View>
  );
}

/** Add RGBA, HSLA, and HSBA numeric fields below the standard area. */
export function ColorPickerChannelInput(): JSX.Element {
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
            <ChannelInputs format="rgba" />
            <ChannelInputs format="hsla" />
            <ChannelInputs format="hsba" />
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}

/** Keep only the hex field, current swatch, and browser pipette. */
export function ColorPickerInputOnly(): JSX.Element {
  return (
    <ColorPicker.Root
      defaultValue={ColorPicker.parseColor('#eb5e41')}
      class="color-picker-example-compact"
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Label>Color</ColorPicker.Label>
      <ColorPicker.Control>
        <InputGroup
          startElement={<ColorPicker.ValueSwatch class="color-picker-example-swatch-compact" />}
          endElementProps={{ class: 'color-picker-example-adornment' }}
          endElement={<ColorPicker.EyeDropper size="xs" variant="ghost" />}
        >
          <ColorPicker.Input class="leverui-input-group__field" />
        </InputGroup>
      </ColorPicker.Control>
    </ColorPicker.Root>
  );
}

/** Use the swatch itself as the opening action within a color input. */
export function ColorPickerTriggerInInput(): JSX.Element {
  return (
    <ColorPicker.Root
      defaultValue={ColorPicker.parseColor('#eb5e41')}
      class="color-picker-example-compact"
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Label>Trigger on swatch</ColorPicker.Label>
      <ColorPicker.Control>
        <InputGroup
          startElementProps={{ class: 'color-picker-example-adornment-interactive' }}
          startElement={
            <ColorPicker.Trigger data-fit-content>
              <ColorPicker.ValueSwatch class="color-picker-example-swatch-compact" />
            </ColorPicker.Trigger>
          }
          endElementProps={{ class: 'color-picker-example-adornment' }}
          endElement={<ColorPicker.EyeDropperTrigger size="xs" variant="ghost" />}
        >
          <ColorPicker.Input class="leverui-input-group__field" />
        </InputGroup>
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.Area />
            <ColorPicker.Sliders />
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}
