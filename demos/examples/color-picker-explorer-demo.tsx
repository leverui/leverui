import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CheckIcon, PlusIcon } from '@lucide/solid';
import { ColorPicker, HStack, IconButton, Square, VStack } from '../../src';

const paletteSwatches = [
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

const channelFormats = ['rgba', 'hsla', 'hsba'] as const;

/** Show one labelled numeric input per channel for a color format. */
function ChannelInputs(props: { format: (typeof channelFormats)[number] }): JSX.Element {
  return (
    <ColorPicker.View format={props.format}>
      <HStack gap="2" wrap="wrap" style={{ width: '100%' }}>
        <For each={ColorPicker.getColorChannels(props.format)}>
          {
            /** Keep each input above its capitalized channel name. */
            (channel) => (
              <VStack gap="1" align="stretch" style={{ flex: '0 0 auto', 'min-width': '60px' }}>
                <ColorPicker.ChannelInput
                  channel={channel}
                  class="color-picker-example-channel-input"
                />
                <ColorPicker.ChannelText style={{ 'text-align': 'center' }}>
                  {channel.charAt(0).toUpperCase() + channel.slice(1)}
                </ColorPicker.ChannelText>
              </VStack>
            )
          }
        </For>
      </HStack>
    </ColorPicker.View>
  );
}

/** Render every anatomy part in an always-open picker for the part Explorer. */
export function ColorPickerExplorerDemo(): JSX.Element {
  return (
    <ColorPicker.Root
      defaultValue={ColorPicker.parseColor('#eb5e41')}
      open
      style={{ width: '100%', 'min-width': '0', 'max-width': '400px', 'align-items': 'flex-start' }}
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Label>
        Pick a color: <ColorPicker.ValueText />
      </ColorPicker.Label>
      <ColorPicker.Control>
        <ColorPicker.Input />
        <ColorPicker.Trigger>
          <ColorPicker.ValueSwatch class="color-picker-example-swatch-large" />
        </ColorPicker.Trigger>
      </ColorPicker.Control>
      <ColorPicker.Positioner>
        <ColorPicker.Content
          class="color-picker-example-inline-content"
          style={{ width: 'min(400px, 70vw)' }}
        >
          <VStack gap="4" align="stretch" style={{ width: '100%' }}>
            <ColorPicker.Area style={{ 'max-height': '150px' }} />
            <ColorPicker.ChannelSlider channel="hue" />
            <ColorPicker.ChannelSlider channel="alpha">
              <ColorPicker.ChannelSliderLabel>Alpha</ColorPicker.ChannelSliderLabel>
              <ColorPicker.ChannelSliderValueText />
              <ColorPicker.TransparencyGrid />
              <ColorPicker.ChannelSliderTrack />
              <ColorPicker.ChannelSliderThumb />
            </ColorPicker.ChannelSlider>
            <HStack gap="3" wrap="wrap">
              <ColorPicker.EyeDropper size="xs" variant="outline" />
              <ColorPicker.FormatTrigger
                asChild={
                  /** Render the format toggle on the styled icon button. */
                  (getProps) => (
                    <IconButton {...getProps()} size="xs" aria-label="Format" variant="outline">
                      F
                    </IconButton>
                  )
                }
              />
              <ColorPicker.FormatSelect />
            </HStack>
            <HStack gap="2" wrap="wrap" style={{ width: '100%' }}>
              <For each={channelFormats}>
                {
                  /** Render the numeric channels of each color format. */
                  (format) => <ChannelInputs format={format} />
                }
              </For>
            </HStack>
            <ColorPicker.SwatchGroup>
              <HStack gap="2" wrap="wrap">
                <For each={paletteSwatches}>
                  {
                    /** Bind each preset color to a swatch trigger. */
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
                <ColorPicker.Trigger>
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
              </HStack>
            </ColorPicker.SwatchGroup>
          </VStack>
        </ColorPicker.Content>
      </ColorPicker.Positioner>
    </ColorPicker.Root>
  );
}
