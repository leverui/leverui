import { type JSX } from '@solidjs/web';
import { Slider, Stack, Text } from '../../src';
import './slider-examples.css';

/** Keep two draggable thumbs on one numeric range. */
export function SliderRangeSlider(): JSX.Element {
  return (
    <Slider.Root class="example-slider-sample" defaultValue={[30, 60]}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
}

/** Compare centered and contained thumb positioning. */
export function SliderThumbAlignment(): JSX.Element {
  return (
    <Stack gap="4" style={{ 'max-width': '200px' }}>
      <Slider.Root
        thumbAlignment="contain"
        thumbSize={{ width: 16, height: 16 }}
        defaultValue={[40]}
      >
        <Slider.Label>Slider (contain)</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
      <Slider.Root thumbAlignment="center" defaultValue={[40]}>
        <Slider.Label>Slider (center)</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
    </Stack>
  );
}

/** Push adjacent range thumbs rather than allowing them to cross. */
export function SliderCollisionBehavior(): JSX.Element {
  return (
    <Stack gap="4" style={{ width: '300px' }}>
      <Slider.Root defaultValue={[30, 70]} thumbCollisionBehavior="push">
        <Slider.Label>Price range</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
      <Text textStyle="sm" class="example-slider-hint">
        Drag one thumb into the other to see it push the other along.
      </Text>
    </Stack>
  );
}

/** Keep at least eight steps between the two thumbs. */
export function SliderPreventOverlap(): JSX.Element {
  return (
    <Slider.Root
      style={{ 'max-width': 'var(--lui-sizes-md)' }}
      defaultValue={[20, 60]}
      minStepsBetweenThumbs={8}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
}
