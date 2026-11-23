import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, Slider, Stack } from '../../src';
import '../slider-example-styles.css';
import './slider-examples.css';

const colors = ['gray', 'blue', 'red', 'green', 'pink'] as const;

/** Render the default 200px slider at value 40. */
export function SliderBasic(): JSX.Element {
  return (
    <Slider.Root class="example-slider-sample" defaultValue={[40]}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
}

/** Compare the three slider sizes with visible labels. */
export function SliderWithSizes(): JSX.Element {
  return (
    <Stack gap="4" class="example-slider-sample">
      <For each={['sm', 'md', 'lg'] as const}>
        {
          /** Give each size its own labeled slider. */
          (size) => (
            <Slider.Root defaultValue={[40]} size={size}>
              <Slider.Label>Slider size: {size}</Slider.Label>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
              </Slider.Control>
            </Slider.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare the two slider variants with visible labels. */
export function SliderWithVariants(): JSX.Element {
  return (
    <Stack gap="4" class="example-slider-sample">
      <For each={['outline', 'solid'] as const}>
        {
          /** Give each variant its own labeled slider. */
          (variant) => (
            <Slider.Root defaultValue={[40]} variant={variant}>
              <Slider.Label>Slider variant: {variant}</Slider.Label>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
              </Slider.Control>
            </Slider.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Preserve the disabled value and appearance. */
export function SliderDisabled(): JSX.Element {
  return (
    <Slider.Root class="example-slider-sample" disabled defaultValue={[40]}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
}

/** Restrict the selected value to ten-unit keyboard steps. */
export function SliderStep(): JSX.Element {
  return (
    <Slider.Root class="example-slider-sample" defaultValue={[40]} step={10}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
}

/** Show a visible Quantity label above the control. */
export function SliderLabel(): JSX.Element {
  return (
    <Slider.Root class="example-slider-sample" defaultValue={[40]}>
      <Slider.Label>Quantity</Slider.Label>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
}

/** Pair the Volume label with a live numeric value. */
export function SliderValueText(): JSX.Element {
  return (
    <Slider.Root style={{ 'max-width': 'var(--lui-sizes-sm)' }} size="sm" defaultValue={[40]}>
      <HStack justify="space-between">
        <Slider.Label>Volume</Slider.Label>
        <Slider.ValueText />
      </HStack>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs class="slider-example-rounded-thumb" />
      </Slider.Control>
    </Slider.Root>
  );
}

/** Orient the control vertically in a 200px area. */
export function SliderVertical(): JSX.Element {
  return (
    <Slider.Root style={{ height: '200px' }} orientation="vertical" defaultValue={[40]}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
}

/** Compare the five palettes at a common value. */
export function SliderColors(): JSX.Element {
  return (
    <Stack gap="4" align="flex-start">
      <For each={colors}>
        {
          /** Give every palette an independent slider machine. */
          (color) => (
            <Slider.Root class="example-slider-sample" colorPalette={color} defaultValue={[40]}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
              </Slider.Control>
            </Slider.Root>
          )
        }
      </For>
    </Stack>
  );
}
