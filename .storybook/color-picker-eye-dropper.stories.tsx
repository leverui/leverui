import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ColorPicker, parseColor } from '../src';

/** Exercise caller callbacks on both EyeDropper button forms. */
function EyeDropperColorPickerStory(): JSX.Element {
  const [clicks, setClicks] = createSignal(0);
  const [ends, setEnds] = createSignal(0);

  /** Count a caller click without replacing the machine's color action. */
  function countClick(): void {
    setClicks(
      /** Advance the displayed caller-click count. */
      (count) => count + 1,
    );
  }

  /** Count committed color changes after the browser picker resolves. */
  function countEnd(): void {
    setEnds(
      /** Advance the displayed committed-change count. */
      (count) => count + 1,
    );
  }

  /** Render a caller-owned button with the machine's live native props. */
  const renderCustom: NonNullable<ColorPicker.EyeDropperTriggerProps['asChild']> = (getProps) => (
    <button {...getProps()} data-testid="color-picker-eye-custom">
      Custom picker
    </button>
  );

  return (
    <>
      <ColorPicker.Root defaultValue={parseColor('#eb5e41')} onValueChangeEnd={countEnd}>
        <ColorPicker.Label>Screen color</ColorPicker.Label>
        <ColorPicker.Control>
          <ColorPicker.Input data-testid="color-picker-eye-input" />
          <ColorPicker.EyeDropper
            data-testid="color-picker-eye-convenience"
            onClick={countClick}
            size="xs"
            variant="outline"
          />
          <ColorPicker.EyeDropperTrigger
            data-testid="color-picker-eye-direct"
            onClick={countClick}
            size="xs"
            variant="outline"
          >
            Direct picker
          </ColorPicker.EyeDropperTrigger>
          <ColorPicker.EyeDropperTrigger
            data-testid="color-picker-eye-loading"
            loading
            size="xs"
            variant="outline"
          >
            Busy picker
          </ColorPicker.EyeDropperTrigger>
          <ColorPicker.EyeDropperTrigger
            asChild={renderCustom}
            onClick={countClick}
            size="xs"
            variant="outline"
          />
        </ColorPicker.Control>
        <output data-testid="color-picker-eye-clicks">{clicks()}</output>
        <output data-testid="color-picker-eye-ends">{ends()}</output>
      </ColorPicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/ColorPicker/EyeDropper',
  component: EyeDropperColorPickerStory,
} satisfies Meta<typeof EyeDropperColorPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Callbacks: Story = { render: EyeDropperColorPickerStory };
