import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { AudioWaveformIcon } from '@lucide/solid';
import { Box, Button, Code, Field, Slider, Stack, type SliderValueChangeDetails } from '../../src';
import '../slider-example-styles.css';

/** Keep the slider's numeric value in a caller-owned Solid signal. */
export function SliderControlled(): JSX.Element {
  const [value, setValue] = createSignal([40]);

  /** Copy the complete numeric array after machine updates. */
  function updateValue(details: SliderValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <Slider.Root style={{ 'max-width': '200px' }} value={value()} onValueChange={updateValue}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
}

/** Show live changes separately from the value committed on release. */
export function SliderChangeEnd(): JSX.Element {
  const [value, setValue] = createSignal([50]);
  const [endValue, setEndValue] = createSignal([50]);

  /** Display the latest value while dragging. */
  function updateValue(details: SliderValueChangeDetails): void {
    setValue(details.value);
  }

  /** Display the last value committed by a finished drag. */
  function updateEndValue(details: SliderValueChangeDetails): void {
    setEndValue(details.value);
  }

  return (
    <Box style={{ 'max-width': '240px' }}>
      <Slider.Root value={value()} onValueChange={updateValue} onValueChangeEnd={updateEndValue}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
      <Stack gap="1" style={{ 'margin-top': 'var(--lui-spacing-3)' }}>
        <Code>
          onChange: <b>{value().join(',')}</b>
        </Code>
        <Code>
          onChangeEnd: <b>{endValue().join(',')}</b>
        </Code>
      </Stack>
    </Box>
  );
}

/** Expose a caller-owned slider store beside its control. */
export function SliderStore(): JSX.Element {
  const slider = Slider.useSlider({ defaultValue: [40], thumbAlignment: 'center' });
  return (
    <Stack align="flex-start">
      <Code>current: {slider().value.join(',')}</Code>
      <Slider.RootProvider value={slider} style={{ width: '200px' }}>
        <Slider.Label>Slider</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.RootProvider>
    </Stack>
  );
}

/** Keep the styled thumb's equalizer decoration and native input. */
export function SliderCustomization(): JSX.Element {
  return (
    <Slider.Root defaultValue={[30]}>
      <Slider.Control>
        <Slider.Track class="slider-example-custom-track">
          <Slider.Range class="slider-example-custom-range" />
        </Slider.Track>
        <Slider.Thumb index={0} class="slider-example-custom-thumb">
          <AudioWaveformIcon class="slider-example-custom-icon" />
          <Slider.HiddenInput />
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
  );
}

/** Recreate the form validation with Solid state. */
export function SliderHookForm(): JSX.Element {
  const [value, setValue] = createSignal([40]);
  const [error, setError] = createSignal('');

  /** Update the form value and clear an old validation error. */
  function updateValue(details: SliderValueChangeDetails): void {
    setValue(details.value);
    setError('');
  }

  /** Require a value of at least 60 before submitting. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    if ((value()[0] ?? 0) < 60) {
      setError('Value must be greater than 60');
      return;
    }
    console.log({ value: value() });
  }

  return (
    <form onSubmit={submit}>
      <Stack align="flex-start" gap="4" style={{ 'max-width': '300px' }}>
        <Field.Root invalid={error().length > 0}>
          <Field.Label>Slider: {value()[0]}</Field.Label>
          <Slider.Root
            style={{ width: '100%' }}
            name="value"
            value={value()}
            onValueChange={updateValue}
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
          <Field.ErrorText>{error()}</Field.ErrorText>
        </Field.Root>
        <Button size="sm" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
