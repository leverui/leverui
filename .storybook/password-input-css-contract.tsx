import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PasswordInput, PasswordStrengthMeter } from '../src';

/** Expose CSS overrides, visibility, strength, and unstyled paths in one story. */
export function PasswordInputCssContract(): JSX.Element {
  const [strength, setStrength] = createSignal(1);

  /** Cycle the meter through all semantic palette states. */
  function advanceStrength(): void {
    setStrength(
      /** Wrap the visible strength levels during interaction checks. */
      (value) => (value === 4 ? 1 : value + 1),
    );
  }

  return (
    <div class="consumer-password-demo">
      <PasswordInput aria-label="Password" rootProps={{ id: 'password-css-root' }} />
      <PasswordInput
        aria-label="Unstyled password"
        unstyled
        rootProps={{ id: 'password-unstyled-root' }}
      />
      <PasswordStrengthMeter value={strength()} data-testid="password-css-meter" />
      <button type="button" onClick={advanceStrength}>
        Advance strength
      </button>
    </div>
  );
}
