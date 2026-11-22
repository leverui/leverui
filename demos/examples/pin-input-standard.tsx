import { type JSX } from '@solidjs/web';
import { Field, PinInput, VStack } from '../../src';

/** Render the default four digit code entry. */
export function PinInputBasic(): JSX.Element {
  return (
    <PinInput.Root count={4}>
      <PinInput.HiddenInput />
      <PinInput.Control>
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
        <PinInput.Input index={2} />
        <PinInput.Input index={3} />
      </PinInput.Control>
    </PinInput.Root>
  );
}

/** Accept letters and numbers in each code field. */
export function PinInputAlphanumeric(): JSX.Element {
  return (
    <PinInput.Root count={4} type="alphanumeric">
      <PinInput.HiddenInput />
      <PinInput.Control>
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
        <PinInput.Input index={2} />
        <PinInput.Input index={3} />
      </PinInput.Control>
    </PinInput.Root>
  );
}

/** Join the four fields into one attached group. */
export function PinInputAttached(): JSX.Element {
  return (
    <PinInput.Root count={4} attached>
      <PinInput.HiddenInput />
      <PinInput.Control>
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
        <PinInput.Input index={2} />
        <PinInput.Input index={3} />
      </PinInput.Control>
    </PinInput.Root>
  );
}

/** Label the code fields through the Field composition. */
export function PinInputWithField(): JSX.Element {
  return (
    <Field.Root>
      <Field.Label>Enter the one-time code</Field.Label>
      <PinInput.Root count={4}>
        <PinInput.HiddenInput />
        <PinInput.Control>
          <PinInput.Input index={0} />
          <PinInput.Input index={1} />
          <PinInput.Input index={2} />
          <PinInput.Input index={3} />
        </PinInput.Control>
      </PinInput.Root>
    </Field.Root>
  );
}

/** Mask entered digits while preserving the native hidden value. */
export function PinInputWithMask(): JSX.Element {
  return (
    <PinInput.Root count={4} mask>
      <PinInput.HiddenInput />
      <PinInput.Control>
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
        <PinInput.Input index={2} />
        <PinInput.Input index={3} />
      </PinInput.Control>
    </PinInput.Root>
  );
}

/** Set browser one time password metadata on the inputs. */
export function PinInputWithOtp(): JSX.Element {
  return (
    <PinInput.Root count={4} otp>
      <PinInput.HiddenInput />
      <PinInput.Control>
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
        <PinInput.Input index={2} />
        <PinInput.Input index={3} />
      </PinInput.Control>
    </PinInput.Root>
  );
}

/** Repeat the celebration placeholder in each field. */
export function PinInputWithPlaceholder(): JSX.Element {
  return (
    <PinInput.Root count={4} placeholder="🥳">
      <PinInput.HiddenInput />
      <PinInput.Control>
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
        <PinInput.Input index={2} />
        <PinInput.Input index={3} />
      </PinInput.Control>
    </PinInput.Root>
  );
}

/** Show the labeled one time code layout inspected by the part Explorer. */
export function PinInputExplorerDemo(): JSX.Element {
  return (
    <PinInput.Root count={4} otp>
      <VStack align="start">
        <PinInput.Label>Enter 4-digit code</PinInput.Label>
        <PinInput.HiddenInput />
        <PinInput.Control>
          <PinInput.Input index={0} />
          <PinInput.Input index={1} />
          <PinInput.Input index={2} />
          <PinInput.Input index={3} />
        </PinInput.Control>
      </VStack>
    </PinInput.Root>
  );
}
