import { type JSX } from '@solidjs/web';
import type { Slider as SliderExport } from '../src';

export type SliderHydrationComponents = {
  Slider: typeof SliderExport;
};

/** Render matching labeled controls under both Slider root modes. */
export function renderSliderHydrationTree({ Slider }: SliderHydrationComponents): JSX.Element {
  const external = Slider.useSlider({
    id: 'hydrated-slider-external',
    name: 'external-volume',
    defaultValue: [40],
  });

  return (
    <>
      <form data-testid="hydrated-slider-form" style={{ width: '360px' }}>
        <Slider.Root
          id="hydrated-slider-primary"
          name="primary-volume"
          defaultValue={[30]}
          step={5}
        >
          <Slider.Label>Hydrated primary</Slider.Label>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0}>
              <Slider.HiddenInput />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.Root>
        <Slider.RootProvider value={external}>
          <Slider.Label>Hydrated external</Slider.Label>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0}>
              <Slider.HiddenInput />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.RootProvider>
      </form>
    </>
  );
}
