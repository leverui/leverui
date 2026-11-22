import { Slider, type SliderValueChangeDetails } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed Slider's controlled value and native form input. */
export function PackedSlider(): JSX.Element {
  const [value, setValue] = createSignal([30]);

  /** Keep the consumer's controlled value synchronized with the primitive. */
  function handleValueChange(details: SliderValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <form data-testid="packed-slider-form">
      <Slider.Root
        name="volume"
        value={value()}
        onValueChange={handleValueChange}
        step={5}
        colorPalette="blue"
        class="packed-slider"
        data-testid="packed-slider-root"
        style={{ width: '300px' }}
      >
        <Slider.Label>Volume</Slider.Label>
        <Slider.ValueText />
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs style={{ padding: '4px' }} />
        </Slider.Control>
        <Slider.Marks
          marks={[0, { value: 50, label: 'Middle' }, 100]}
          style={{ 'margin-top': '8px' }}
        />
      </Slider.Root>
      <output data-testid="packed-slider-value">{value()[0]}</output>
    </form>
  );
}
