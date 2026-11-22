import { createSignal, createUniqueId, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CheckIcon, MoonIcon, SunIcon, XIcon } from '@lucide/solid';
import { Button, Field, Stack, Switch, type SwitchCheckedChangeDetails, Tooltip } from '../../src';
import './switch-examples.css';

/** Keep the example's selection in a Solid form signal. */
export function SwitchWithHookForm(): JSX.Element {
  const [checked, setChecked] = createSignal<boolean | undefined>(undefined);
  const [invalid, setInvalid] = createSignal(false);

  /** Synchronize the form value with the switch machine. */
  function updateChecked(details: SwitchCheckedChangeDetails): void {
    setChecked(details.checked);
    setInvalid(false);
  }

  /** Require an explicit boolean choice before submitting. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    const value = checked();
    setInvalid(value === undefined);
    if (value !== undefined) console.log({ active: value });
  }

  return (
    <form onSubmit={submit}>
      <Stack align="flex-start">
        <Field.Root invalid={invalid()}>
          <Switch.Root name="active" checked={checked()} onCheckedChange={updateChecked}>
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>Email notifications</Switch.Label>
          </Switch.Root>
          <Show when={invalid()}>
            <Field.ErrorText>Choose on or off before you submit.</Field.ErrorText>
          </Show>
        </Field.Root>
        <Button size="sm" type="submit" class="example-switch-submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}

/** Put checked and unchecked glyphs inside the switch thumb. */
export function SwitchWithThumbIndicator(): JSX.Element {
  return (
    <Switch.Root size="lg">
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb>
          <Switch.ThumbIndicator fallback={<XIcon class="example-switch-off-icon" />}>
            <CheckIcon />
          </Switch.ThumbIndicator>
        </Switch.Thumb>
      </Switch.Control>
      <Switch.Label>Auto-save</Switch.Label>
    </Switch.Root>
  );
}

/** Attach a tooltip to the same native switch root. */
export function SwitchWithTooltip(): JSX.Element {
  const triggerId = createUniqueId();
  return (
    <Tooltip ids={{ trigger: triggerId }} content="Turns off Wi-Fi and mobile data">
      {
        /** Keep Tooltip trigger events on the switch root. */
        (getProps) => (
          <Switch.Root {...getProps()} id={triggerId} ids={{ root: triggerId }}>
            <Switch.HiddenInput aria-describedby={getProps()['aria-describedby']} />
            <Switch.Control />
            <Switch.Label>Airplane mode</Switch.Label>
          </Switch.Root>
        )
      }
    </Tooltip>
  );
}

/** Put sun and moon glyphs on the switch track. */
export function SwitchWithTrackIndicator(): JSX.Element {
  return (
    <Switch.Root colorPalette="blue" size="lg">
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb />
        <Switch.Indicator fallback={<MoonIcon class="example-switch-moon-icon" />}>
          <SunIcon class="example-switch-sun-icon" />
        </Switch.Indicator>
      </Switch.Control>
      <Switch.Label>Light mode</Switch.Label>
    </Switch.Root>
  );
}
