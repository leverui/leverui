import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import { createSignal, flush } from 'solid-js';
import { Switch } from '../index';

afterEach(cleanup);

/** Mount a named Switch with its default thumb and native form input. */
function DefaultSwitch() {
  return (
    <>
      <form data-testid="switch-form">
        <Switch.Root name="notifications" value="yes" defaultChecked>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Notifications</Switch.Label>
        </Switch.Root>
      </form>
    </>
  );
}

/** Verify the default composition keeps native input and recipe semantics. */
async function verifiesDefaultSwitch(): Promise<void> {
  render(
    /** Create the root inside the provider's style context. */
    () => <DefaultSwitch />,
  );
  const input = screen.getByRole('checkbox', { name: 'Notifications' });
  expect(input).toBeChecked();
  expect(input.closest('[data-switch-root]')).toHaveClass('leverui-switch__root');
  expect(document.querySelector('.leverui-switch__control')).not.toBeNull();
  expect(document.querySelector('.leverui-switch__thumb')).not.toBeNull();
  expect(
    new FormData(screen.getByTestId('switch-form') as HTMLFormElement).get('notifications'),
  ).toBe('yes');
  fireEvent.click(input);
  await waitFor(
    /** Wait for Zag's machine update after the native input click. */
    () => expect(input.closest('[data-switch-root]')).toHaveAttribute('data-state', 'unchecked'),
  );
  expect(
    new FormData(screen.getByTestId('switch-form') as HTMLFormElement).has('notifications'),
  ).toBe(false);
}

it('renders the default thumb and updates a native form value', verifiesDefaultSwitch);

/** Show controlled state and both optional checked indicators. */
function ControlledSwitch() {
  const [checked, setChecked] = createSignal(false);

  /** Keep the machine controlled by the owning Solid signal. */
  function handleCheckedChange(details: { checked: boolean }): void {
    setChecked(details.checked);
    flush();
  }

  return (
    <>
      <Switch.Root checked={checked()} onCheckedChange={handleCheckedChange}>
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Indicator fallback="Track off">Track on</Switch.Indicator>
          <Switch.Thumb>
            <Switch.ThumbIndicator fallback="Thumb off">Thumb on</Switch.ThumbIndicator>
          </Switch.Thumb>
        </Switch.Control>
        <Switch.Label>Sync</Switch.Label>
      </Switch.Root>
    </>
  );
}

/** Verify controlled updates choose the matching indicator branches. */
async function verifiesControlledIndicators(): Promise<void> {
  render(
    /** Create the controlled composition inside its provider. */
    () => <ControlledSwitch />,
  );
  const input = screen.getByRole('checkbox', { name: 'Sync' });
  expect(screen.getByText('Track off')).toHaveClass('leverui-switch__indicator');
  expect(screen.getByText('Thumb off')).toHaveClass('leverui-switch__thumbIndicator');
  fireEvent.click(input);
  await waitFor(
    /** Wait for the controlled signal to update both indicator branches. */
    () => expect(screen.getByText('Track on')).toHaveAttribute('data-checked'),
  );
  expect(input).toBeChecked();
  expect(screen.getByText('Thumb on')).toHaveAttribute('data-checked');
}

it('updates controlled track and thumb indicators', verifiesControlledIndicators);
