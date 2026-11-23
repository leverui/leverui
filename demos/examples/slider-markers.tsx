import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Slider, Stack, Text, VStack } from '../../src';
import '../slider-example-styles.css';

const sizes = ['sm', 'md', 'lg'] as const;
const customMarks = [
  { value: 20, label: 'Low', color: 'green.fg' },
  { value: 50, label: 'Medium', color: 'orange.fg' },
  { value: 80, label: 'High', color: 'red.fg' },
] as const;

/** Compare numeric marks at all three CSS sizes. */
export function SliderMarks(): JSX.Element {
  return (
    <Stack gap="4">
      <For each={sizes}>
        {
          /** Give each size its own marked slider. */
          (size) => (
            <VStack align="flex-start">
              <Slider.Root size={size} defaultValue={[40]} style={{ width: '200px' }}>
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumbs />
                  <Slider.Marks marks={[0, 50, 100]} />
                </Slider.Control>
              </Slider.Root>
              <Text>size = {size}</Text>
            </VStack>
          )
        }
      </For>
    </Stack>
  );
}

/** Label the horizontal pink slider at 0, 50, and 100 percent. */
export function SliderMarksAndLabel(): JSX.Element {
  return (
    <Slider.Root style={{ width: '200px' }} colorPalette="pink" defaultValue={[40]}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
        <Slider.Marks
          marks={[
            { value: 0, label: '0%' },
            { value: 50, label: '50%' },
            { value: 100, label: '100%' },
          ]}
        />
      </Slider.Control>
    </Slider.Root>
  );
}

/** Label the same marks along a vertical pink slider. */
export function SliderMarksVertical(): JSX.Element {
  return (
    <Slider.Root
      style={{ height: '200px' }}
      orientation="vertical"
      colorPalette="pink"
      defaultValue={[40]}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
        <Slider.Marks
          marks={[
            { value: 0, label: '0%' },
            { value: 50, label: '50%' },
            { value: 100, label: '100%' },
          ]}
        />
      </Slider.Control>
    </Slider.Root>
  );
}

/** Show the selected value only while dragging its thumb. */
export function SliderDraggingIndicator(): JSX.Element {
  return (
    <Slider.Root style={{ 'max-width': '200px' }} defaultValue={[40]}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0}>
          <Slider.DraggingIndicator class="slider-example-drag-indicator">
            <Slider.ValueText />
          </Slider.DraggingIndicator>
          <Slider.HiddenInput />
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
  );
}

/** Render marker indicators with semantic color labels. */
export function SliderCustomMarkerLabels(): JSX.Element {
  return (
    <Slider.Root style={{ width: 'var(--lui-sizes-xs)' }} defaultValue={[50]}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
        <Slider.MarkerGroup>
          <For each={customMarks}>
            {
              /** Keep each label aligned to its numeric mark. */
              (mark) => (
                <Slider.Marker value={mark.value}>
                  <Slider.MarkerIndicator />
                  <Slider.MarkerLabel
                    style={{
                      color: `var(--lui-colors-${mark.color.replace('.', '-')})`,
                      'font-weight': 'var(--lui-font-weights-medium)',
                    }}
                  >
                    {mark.label}
                  </Slider.MarkerLabel>
                </Slider.Marker>
              )
            }
          </For>
        </Slider.MarkerGroup>
      </Slider.Control>
    </Slider.Root>
  );
}
