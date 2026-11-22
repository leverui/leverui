import { type JSX } from '@solidjs/web';
import { Slider, Stack } from '../../src';

/** Render every Slider part for the guide's anatomy explorer. */
export function SliderExplorerDemo(): JSX.Element {
  return (
    <Stack gap="8" style={{ 'max-width': '280px', width: '100%' }}>
      <Slider.Root defaultValue={[40]}>
        <Slider.Label>Volume</Slider.Label>
        <Slider.ValueText />
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0}>
            <Slider.DraggingIndicator />
            <Slider.HiddenInput />
          </Slider.Thumb>
          <Slider.MarkerGroup>
            <Slider.Marker value={0}>
              <Slider.MarkerIndicator />
              <Slider.MarkerLabel>0</Slider.MarkerLabel>
            </Slider.Marker>
            <Slider.Marker value={50}>
              <Slider.MarkerIndicator />
              <Slider.MarkerLabel>50</Slider.MarkerLabel>
            </Slider.Marker>
            <Slider.Marker value={100}>
              <Slider.MarkerIndicator />
              <Slider.MarkerLabel>100</Slider.MarkerLabel>
            </Slider.Marker>
          </Slider.MarkerGroup>
        </Slider.Control>
      </Slider.Root>
    </Stack>
  );
}
