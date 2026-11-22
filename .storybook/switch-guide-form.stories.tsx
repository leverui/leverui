import { createSignal, createUniqueId, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button, Field, Switch, type SwitchCheckedChangeDetails } from '../src';

/** Translate the guide's controller into Solid-owned boolean form state. */
function SwitchGuideForm(): JSX.Element {
  const errorId = createUniqueId();
  const [checked, setChecked] = createSignal<boolean | undefined>(undefined);
  const [touched, setTouched] = createSignal(false);
  const [invalid, setInvalid] = createSignal(false);
  const [submitted, setSubmitted] = createSignal('');

  /** Keep the controller signal in sync with the primitive's machine. */
  function changeChecked(details: SwitchCheckedChangeDetails): void {
    setChecked(details.checked);
    setInvalid(false);
  }

  /** Mark the controller touched when its native input loses focus. */
  function blurInput(): void {
    setTouched(true);
  }

  /** Reject an unset controller value while accepting either boolean. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    const value = checked();
    if (value === undefined) {
      setInvalid(true);
      return;
    }
    setSubmitted(String(value));
  }

  return (
    <>
      <form
        data-testid="switch-guide-form"
        data-touched={String(touched())}
        onSubmit={submit}
        style={{ display: 'grid', gap: '16px', padding: '24px', width: '300px' }}
      >
        <Field.Root invalid={invalid()}>
          <Switch.Root
            name="active"
            value="yes"
            checked={checked()}
            onCheckedChange={changeChecked}
            invalid={invalid()}
          >
            <Switch.HiddenInput
              onBlur={blurInput}
              aria-describedby={invalid() ? errorId : undefined}
            />
            <Switch.Control />
            <Switch.Label>Activate account</Switch.Label>
          </Switch.Root>
          <Show when={invalid()}>
            <Field.ErrorText id={errorId}>Active is required</Field.ErrorText>
          </Show>
        </Field.Root>
        <Button type="submit">Submit activation</Button>
        <output data-testid="switch-guide-result">{submitted()}</output>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Switch Guide Form',
  component: SwitchGuideForm,
} satisfies Meta<typeof SwitchGuideForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Controlled: Story = { render: SwitchGuideForm };
