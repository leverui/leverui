import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ColorPicker, HStack, parseColor } from '../src';

/** Exercise the input, trigger, popover, area, and sliders. */
function BasicColorPickerStory(): JSX.Element {
  return (
    <>
      <ColorPicker.Root defaultValue={parseColor('#eb5e41')}>
        <ColorPicker.HiddenInput data-testid="color-picker-hidden" />
        <ColorPicker.Label>Color</ColorPicker.Label>
        <ColorPicker.Control>
          <ColorPicker.Input data-testid="color-picker-input" />
          <ColorPicker.Trigger data-testid="color-picker-trigger" />
        </ColorPicker.Control>
        <ColorPicker.Positioner>
          <ColorPicker.Content data-testid="color-picker-content">
            <ColorPicker.Area data-testid="color-picker-area" />
            <HStack>
              <ColorPicker.EyeDropper aria-label="Pick screen color" size="xs" variant="outline" />
              <ColorPicker.Sliders />
            </HStack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </ColorPicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/ColorPicker',
  component: BasicColorPickerStory,
} satisfies Meta<typeof BasicColorPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: BasicColorPickerStory };

/** Show signal-owned color value and a preset swatch in one picker. */
function ControlledColorPickerStory(): JSX.Element {
  const [value, setValue] = createSignal(parseColor('#ff0000'));

  /** Apply the selected machine color to the owning signal. */
  function updateValue(details: ColorPicker.ValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <>
      <ColorPicker.Root value={value()} onValueChange={updateValue}>
        <ColorPicker.Label>Controlled color</ColorPicker.Label>
        <ColorPicker.Control>
          <ColorPicker.Input data-testid="color-picker-controlled-input" />
          <ColorPicker.Trigger data-testid="color-picker-controlled-trigger" />
        </ColorPicker.Control>
        <ColorPicker.ValueText data-testid="color-picker-controlled-value" />
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.Area />
            <ColorPicker.Sliders />
            <ColorPicker.SwatchGroup>
              <ColorPicker.SwatchTrigger value="#0000ff" aria-label="Blue color">
                <ColorPicker.Swatch value="#0000ff" />
              </ColorPicker.SwatchTrigger>
            </ColorPicker.SwatchGroup>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </ColorPicker.Root>
    </>
  );
}

export const Controlled: Story = { render: ControlledColorPickerStory };

/** Exercise read-only and disabled machine states in the browser. */
function DisabledColorPickerStory(): JSX.Element {
  return (
    <>
      <ColorPicker.Root defaultValue={parseColor('#009688')} disabled>
        <ColorPicker.Label>Disabled color</ColorPicker.Label>
        <ColorPicker.Control>
          <ColorPicker.Input data-testid="color-picker-disabled-input" />
          <ColorPicker.Trigger data-testid="color-picker-disabled-trigger" />
        </ColorPicker.Control>
      </ColorPicker.Root>
    </>
  );
}

export const Disabled: Story = { render: DisabledColorPickerStory };

/** Mount a caller-owned primitive machine through the public RootProvider. */
function ProviderColorPickerStory(): JSX.Element {
  const machine = ColorPicker.useColorPicker({ defaultValue: parseColor('#336699') });

  return (
    <>
      <ColorPicker.PropsProvider value={{ size: 'sm' }}>
        <ColorPicker.RootProvider value={machine}>
          <ColorPicker.Label>Stored color</ColorPicker.Label>
          <ColorPicker.Control>
            <ColorPicker.Input data-testid="color-picker-provider-input" />
            <ColorPicker.Trigger data-testid="color-picker-provider-trigger" />
          </ColorPicker.Control>
          <ColorPicker.Positioner>
            <ColorPicker.Content data-testid="color-picker-provider-content">
              <ColorPicker.Area />
            </ColorPicker.Content>
          </ColorPicker.Positioner>
        </ColorPicker.RootProvider>
      </ColorPicker.PropsProvider>
    </>
  );
}

export const Provider: Story = { render: ProviderColorPickerStory };
