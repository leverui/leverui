import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, test } from 'vitest';
import { PasswordInput, PasswordStrengthMeter } from '../index';

afterEach(cleanup);

/** Keep password text, input ref, and uncontrolled visibility native. */
function verifiesUncontrolledPassword(): void {
  let received: HTMLInputElement | undefined;

  /** Capture the native input exposed by Password Input. */
  function capture(element: HTMLInputElement): void {
    received = element;
  }

  render(
    /** Mount a password with an initial value and native ref. */
    () => (
      <>
        <PasswordInput aria-label="Password" defaultValue="secret" ref={capture} />
      </>
    ),
  );
  const input = screen.getByLabelText('Password') as HTMLInputElement;
  const trigger = screen.getByRole('button', { name: 'Toggle password visibility' });
  expect(input).toBe(received);
  expect(input.value).toBe('secret');
  expect(input.type).toBe('password');
  fireEvent.pointerDown(trigger, { button: 0 });
  expect(input.type).toBe('text');
  expect(input.value).toBe('secret');
  fireEvent.pointerDown(trigger, { button: 0 });
  expect(input.type).toBe('password');
}

test('Password Input preserves native value, ref, and visibility', verifiesUncontrolledPassword);

/** Follow controlled visibility while ignoring secondary presses and disabled state. */
function verifiesControlledPassword(): void {
  const [visible, setVisible] = createSignal(false);

  /** Update the controlled visibility signal. */
  function updateVisible(next: boolean): void {
    setVisible(next);
    flush();
  }

  /** Mount the controlled password with a custom visibility icon. */
  function Example(): JSX.Element {
    return (
      <>
        <PasswordInput
          aria-label="Controlled password"
          visible={visible()}
          onVisibleChange={updateVisible}
          visibilityIcon={{ on: <span>Show mark</span>, off: <span>Hide mark</span> }}
        />
      </>
    );
  }

  render(
    /** Keep the password mounted while its visibility changes. */
    () => <Example />,
  );
  const input = screen.getByLabelText('Controlled password') as HTMLInputElement;
  const trigger = screen.getByRole('button', { name: 'Toggle password visibility' });
  expect(screen.getByText('Show mark')).toBeTruthy();
  fireEvent.pointerDown(trigger, { button: 2 });
  expect(input.type).toBe('password');
  fireEvent.pointerDown(trigger, { button: 0 });
  expect(input.type).toBe('text');
  expect(screen.getByText('Hide mark')).toBeTruthy();
}

test('Password Input supports controlled visibility', verifiesControlledPassword);

/** Keep the disabled password hidden and forward Group attributes. */
function verifiesDisabledPassword(): void {
  render(
    /** Mount a disabled password with attributes on its outer group. */
    () => (
      <>
        <PasswordInput
          aria-label="Disabled password"
          disabled
          rootProps={{ title: 'Password group' }}
        />
      </>
    ),
  );
  const input = screen.getByLabelText('Disabled password') as HTMLInputElement;
  const trigger = screen.getByRole('button', { name: 'Toggle password visibility' });
  expect(input.disabled).toBe(true);
  expect(trigger.hasAttribute('disabled')).toBe(true);
  expect(screen.getByTitle('Password group').contains(input)).toBe(true);
  fireEvent.pointerDown(trigger, { button: 0 });
  expect(input.type).toBe('password');
}

test('Password Input keeps disabled state and forwards root props', verifiesDisabledPassword);

/** Update strength segments and their label when a Solid signal changes. */
function verifiesStrengthMeter(): void {
  const [strength, setStrength] = createSignal(0);
  render(
    /** Render a reactive strength meter in one Solid owner. */
    () => (
      <>
        <PasswordStrengthMeter value={strength()} data-testid="strength-meter" />
      </>
    ),
  );
  const meter = screen.getByTestId('strength-meter');
  expect(meter.querySelectorAll('[data-selected]')).toHaveLength(0);
  expect(screen.getByText('Low')).toBeTruthy();
  setStrength(3);
  flush();
  expect(meter.querySelectorAll('[data-selected]')).toHaveLength(3);
  expect(screen.getByText('High')).toBeTruthy();
}

test('Password Strength Meter follows a reactive value', verifiesStrengthMeter);
