import { passwordStrength, type Options } from 'check-password-strength';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PasswordInput, PasswordStrengthMeter, Stack } from '../../src';

const strengthOptions: Options<string> = [
  { id: 1, value: 'weak', minDiversity: 0, minLength: 0 },
  { id: 2, value: 'medium', minDiversity: 2, minLength: 6 },
  { id: 3, value: 'strong', minDiversity: 3, minLength: 8 },
  { id: 4, value: 'very-strong', minDiversity: 4, minLength: 10 },
];

/** Show the reactive password strength display. */
export function PasswordInputWithStrengthIndicator(): JSX.Element {
  const [password, setPassword] = createSignal('');
  /** Derive the current meter level from the entered password. */
  const strength = (): number =>
    password() ? passwordStrength(password(), strengthOptions).id : 0;

  /** Keep the meter synchronized with each native input event. */
  function updatePassword(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setPassword(event.currentTarget.value);
  }

  return (
    <Stack gap="3" style={{ 'max-width': '300px' }}>
      <PasswordInput
        value={password()}
        onInput={updatePassword}
        placeholder="Enter your password"
      />
      <PasswordStrengthMeter value={strength()} />
    </Stack>
  );
}
