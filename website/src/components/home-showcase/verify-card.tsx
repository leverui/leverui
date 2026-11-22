import { Button, Card, PinInput } from '@leverui/components';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';

const digits = Array.from({ length: 6 }, (_, index) => index);

/** A six-digit sign-in code, one field per digit. */
export function VerifyCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>Check your email</Card.Title>
        <Card.Description>Enter the 6-digit code we sent you.</Card.Description>
      </Card.Header>
      <Card.Body>
        <div class="home-example-stack">
          <PinInput.Root
            count={6}
            size="sm"
            otp
            aria-label="Sign-in code"
            class="home-showcase-code"
          >
            <PinInput.HiddenInput />
            <PinInput.Control>
              <For each={digits}>
                {/** One field for one digit. */}
                {(digit) => <PinInput.Input index={digit} />}
              </For>
            </PinInput.Control>
          </PinInput.Root>
          <Button type="button" colorPalette="cyan" size="sm">
            Verify
          </Button>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
