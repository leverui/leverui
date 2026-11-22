import { createSignal, createUniqueId, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  Button,
  Field,
  Slider,
  type SliderFocusChangeDetails,
  type SliderValueChangeDetails,
} from '../src';

/** Translate the form controller into Solid-owned numeric state. */
function ControlledSliderForm(): JSX.Element {
  const errorId = createUniqueId();
  const [value, setValue] = createSignal([40]);
  const [touched, setTouched] = createSignal(false);
  const [invalid, setInvalid] = createSignal(false);
  const [submitted, setSubmitted] = createSignal('');

  /** Keep the controller's numeric value synchronized with the Slider machine. */
  function changeValue(details: SliderValueChangeDetails): void {
    setValue(details.value);
    setInvalid(false);
  }

  /** Hand the controller its blur event after the final thumb loses focus. */
  function changeFocus(details: SliderFocusChangeDetails): void {
    if (details.focusedIndex === -1) setTouched(true);
  }

  /** Validate the controlled value and read its real native form entry. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) {
      throw new TypeError('Slider form submit target must be a form.');
    }
    if ((value()[0] ?? 0) < 60) {
      setInvalid(true);
      return;
    }
    setSubmitted(String(new FormData(event.currentTarget).get('value') ?? ''));
  }

  return (
    <>
      <form
        data-testid="slider-controlled-guide-form"
        data-touched={String(touched())}
        onSubmit={submit}
        style={{ width: '320px', padding: '24px' }}
      >
        <Field.Root invalid={invalid()}>
          <Slider.Root
            name="value"
            value={value()}
            onValueChange={changeValue}
            onFocusChange={changeFocus}
            invalid={invalid()}
          >
            <Slider.Label>Slider: {value()[0]}</Slider.Label>
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs
                aria-invalid={invalid() ? 'true' : undefined}
                aria-describedby={invalid() ? errorId : undefined}
              />
            </Slider.Control>
          </Slider.Root>
          <Show when={invalid()}>
            <Field.ErrorText id={errorId}>Value must be at least 60</Field.ErrorText>
          </Show>
        </Field.Root>
        <Button type="submit">Submit value</Button>
        <output data-testid="slider-controlled-guide-result">{submitted()}</output>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Slider Guide Form',
  component: ControlledSliderForm,
} satisfies Meta<typeof ControlledSliderForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Controlled: Story = { render: ControlledSliderForm };
