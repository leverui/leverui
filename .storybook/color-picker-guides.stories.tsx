import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ColorPicker, Portal, parseColor } from '../src';

/** Show format-specific fields and machine-owned channel controls. */
function ChannelColorPickerStory(): JSX.Element {
  const [ended, setEnded] = createSignal('none');

  /** Display the last committed value after a drag or channel edit. */
  function recordEnd(details: ColorPicker.ValueChangeDetails): void {
    setEnded(details.valueAsString);
  }

  return (
    <>
      <ColorPicker.Root
        defaultValue={parseColor('#eb5e41').toFormat('hsba')}
        onValueChangeEnd={recordEnd}
        defaultFormat="hsba"
      >
        <ColorPicker.Context>
          {
            /** Display the active format from the nearest color machine. */
            (api) => (
              <output data-testid="color-picker-guide-format-state">
                {api().value.getFormat()}
              </output>
            )
          }
        </ColorPicker.Context>
        <ColorPicker.HiddenInput name="channel-color" data-testid="color-picker-guide-hidden" />
        <ColorPicker.Label data-testid="color-picker-guide-label">Channel color</ColorPicker.Label>
        <ColorPicker.Control>
          <ColorPicker.Input data-testid="color-picker-guide-hex" />
          <ColorPicker.Trigger data-testid="color-picker-guide-trigger" />
        </ColorPicker.Control>
        <Portal>
          <ColorPicker.Positioner>
            <ColorPicker.Content data-testid="color-picker-guide-content">
              <ColorPicker.Area data-testid="color-picker-guide-area" />
              <ColorPicker.ChannelSlider channel="hue" data-testid="color-picker-guide-hue">
                <ColorPicker.ChannelSliderLabel>Hue</ColorPicker.ChannelSliderLabel>
                <ColorPicker.ChannelSliderTrack />
                <ColorPicker.ChannelSliderThumb />
              </ColorPicker.ChannelSlider>
              <ColorPicker.ChannelSlider channel="alpha">
                <ColorPicker.ChannelSliderLabel>Alpha</ColorPicker.ChannelSliderLabel>
                <ColorPicker.ChannelSliderTrack />
                <ColorPicker.ChannelSliderThumb />
                <ColorPicker.ChannelSliderValueText />
              </ColorPicker.ChannelSlider>
              <ColorPicker.FormatSelect data-testid="color-picker-guide-format" />
              <ColorPicker.View format="rgba" data-testid="color-picker-guide-rgba">
                <ColorPicker.ChannelInput channel="red" data-testid="color-picker-guide-red" />
                <ColorPicker.ChannelInput channel="green" />
                <ColorPicker.ChannelInput channel="blue" />
                <ColorPicker.ChannelInput channel="alpha" />
              </ColorPicker.View>
              <ColorPicker.View format="hsla" data-testid="color-picker-guide-hsla">
                <ColorPicker.ChannelInput
                  channel="hue"
                  data-testid="color-picker-guide-hue-input"
                />
                <ColorPicker.ChannelInput channel="saturation" />
                <ColorPicker.ChannelInput channel="lightness" />
              </ColorPicker.View>
            </ColorPicker.Content>
          </ColorPicker.Positioner>
        </Portal>
        <output data-testid="color-picker-guide-ended">{ended()}</output>
      </ColorPicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/ColorPicker/Guides',
  component: ChannelColorPickerStory,
} satisfies Meta<typeof ChannelColorPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Channels: Story = { render: ChannelColorPickerStory };

/** Show the read-only color state without disabling focus. */
function ReadOnlyColorPickerStory(): JSX.Element {
  return (
    <>
      <ColorPicker.Root defaultValue={parseColor('#eb5e41')} readOnly>
        <ColorPicker.HiddenInput />
        <ColorPicker.Label>Read-only color</ColorPicker.Label>
        <ColorPicker.Control>
          <ColorPicker.Input data-testid="color-picker-readonly-input" />
          <ColorPicker.Trigger data-testid="color-picker-readonly-trigger" />
        </ColorPicker.Control>
        <ColorPicker.Positioner>
          <ColorPicker.Content data-testid="color-picker-readonly-content">
            <ColorPicker.Area />
            <ColorPicker.Sliders />
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </ColorPicker.Root>
    </>
  );
}

export const ReadOnly: Story = { render: ReadOnlyColorPickerStory };
