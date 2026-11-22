import { PinInput } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Exercise an installed Pin Input with native form and consumer CSS. */
export function PackedPinInput(): JSX.Element {
  return (
    <section class="packed-pin-input" aria-label="Packed Pin Input example">
      <PinInput.Root count={4} name="code" mask defaultValue={['', '', '', '']}>
        <PinInput.Label>Verification code</PinInput.Label>
        <PinInput.HiddenInput />
        <PinInput.Control>
          <PinInput.Input index={0} data-testid="packed-pin-0" />
          <PinInput.Input index={1} data-testid="packed-pin-1" />
          <PinInput.Input index={2} data-testid="packed-pin-2" />
          <PinInput.Input index={3} data-testid="packed-pin-3" />
        </PinInput.Control>
      </PinInput.Root>
    </section>
  );
}
