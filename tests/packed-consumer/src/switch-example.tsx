import { Switch, type SwitchCheckedChangeDetails } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed Switch's controlled state and native form value. */
export function PackedSwitch(): JSX.Element {
  const [checked, setChecked] = createSignal(false);

  /** Keep the consumer's Solid signal synchronized with the machine. */
  function handleCheckedChange(details: SwitchCheckedChangeDetails): void {
    setChecked(details.checked);
  }

  return (
    <form data-testid="packed-switch-form">
      <Switch.Root
        name="notifications"
        value="yes"
        checked={checked()}
        onCheckedChange={handleCheckedChange}
        colorPalette="blue"
        class="packed-switch"
        data-testid="packed-switch-root"
      >
        <Switch.HiddenInput />
        <Switch.Control data-testid="packed-switch-control">
          <Switch.Indicator fallback="Off">On</Switch.Indicator>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Notifications</Switch.Label>
      </Switch.Root>
      <output data-testid="packed-switch-value">{checked() ? 'on' : 'off'}</output>
    </form>
  );
}
