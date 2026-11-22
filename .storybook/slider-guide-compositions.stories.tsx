import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Slider } from '../src';
import { sliderGuideEqualizerPath } from './slider-guide-equalizer.mjs';
import '../demos/slider-example-styles.css';

const palettes = ['gray', 'blue', 'red', 'green', 'pink'] as const;
const verticalMarks = [
  { value: 0, label: '0%' },
  { value: 50, label: '50%' },
  { value: 100, label: '100%' },
];

/** Reuse the track and generated-thumb anatomy. */
function SliderParts(props: { marks?: JSX.Element }): JSX.Element {
  return (
    <Slider.Control>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumbs />
      {props.marks}
    </Slider.Control>
  );
}

/** Show each palette through the same public CSS selectors. */
function PaletteSliders(): JSX.Element {
  return (
    <>
      <div style={{ display: 'flex', 'flex-direction': 'column', gap: '24px', padding: '24px' }}>
        <For each={palettes}>
          {
            /** Give each palette its own accessible numeric machine. */
            (palette) => (
              <Slider.Root
                data-testid={`slider-palette-${palette}`}
                style={{ width: '200px' }}
                colorPalette={palette}
                defaultValue={[40]}
              >
                <Slider.Label>{palette} value</Slider.Label>
                <SliderParts />
              </Slider.Root>
            )
          }
        </For>
      </div>
    </>
  );
}

/** Position labeled marks against a vertical pink Slider. */
function VerticalMarks(): JSX.Element {
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Slider.Root
          data-testid="slider-vertical-marks"
          style={{ height: '200px' }}
          orientation="vertical"
          colorPalette="pink"
          defaultValue={[40]}
        >
          <Slider.Label>Vertical percentage</Slider.Label>
          <SliderParts marks={<Slider.Marks marks={verticalMarks} />} />
        </Slider.Root>
      </div>
    </>
  );
}

/** Compare contained and centered thumb alignment with a ten-unit step. */
function AlignmentAndSteps(): JSX.Element {
  return (
    <>
      <div style={{ display: 'flex', 'flex-direction': 'column', gap: '28px', padding: '24px' }}>
        <Slider.Root
          data-testid="slider-align-contain"
          style={{ width: '200px' }}
          thumbAlignment="contain"
          thumbSize={{ width: 16, height: 16 }}
          defaultValue={[40]}
          step={10}
        >
          <Slider.Label>Slider contain</Slider.Label>
          <Slider.ValueText />
          <SliderParts />
        </Slider.Root>
        <Slider.Root
          data-testid="slider-align-center"
          style={{ width: '200px' }}
          thumbAlignment="center"
          defaultValue={[40]}
          step={10}
        >
          <Slider.Label>Slider center</Slider.Label>
          <Slider.ValueText />
          <SliderParts />
        </Slider.Root>
      </div>
    </>
  );
}

/** Replace the thumb's decoration while retaining native Slider behavior. */
function CustomThumb(): JSX.Element {
  return (
    <>
      <form data-testid="slider-custom-form" style={{ padding: '24px' }}>
        <Slider.Root
          data-testid="slider-custom"
          defaultValue={[30]}
          style={{ width: '240px' }}
          name="level"
        >
          <Slider.Label>Custom level</Slider.Label>
          <Slider.Control>
            <Slider.Track class="slider-example-custom-track">
              <Slider.Range class="slider-example-custom-range" />
            </Slider.Track>
            <Slider.Thumb index={0} class="slider-example-custom-thumb">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="1em" height="1em">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d={sliderGuideEqualizerPath} fill="currentColor" />
              </svg>
              <Slider.HiddenInput />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.Root>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Slider Guide Compositions',
  component: PaletteSliders,
} satisfies Meta<typeof PaletteSliders>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Palettes: Story = { render: PaletteSliders };
export const Vertical: Story = { render: VerticalMarks };
export const Alignment: Story = { render: AlignmentAndSteps };
export const Custom: Story = { render: CustomThumb };
