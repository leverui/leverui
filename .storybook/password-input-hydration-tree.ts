import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  PasswordInput as PasswordInputExport,
  PasswordStrengthMeter as PasswordStrengthMeterExport,
} from '../src';

interface PasswordHydrationComponents {
  PasswordInput: typeof PasswordInputExport;
  PasswordStrengthMeter: typeof PasswordStrengthMeterExport;
}

/** Render identical password controls from the server and browser entries. */
export function renderPasswordHydrationTree({
  PasswordInput,
  PasswordStrengthMeter,
}: PasswordHydrationComponents): JSX.Element {
  return [
    createComponent(PasswordInput, {
      'aria-label': 'Hydrated password',
      defaultValue: 'secret',
      rootProps: { id: 'hydrated-password-root' },
    }),
    createComponent(PasswordStrengthMeter, {
      value: 3,
      'data-testid': 'hydrated-strength-meter',
    }),
  ];
}
