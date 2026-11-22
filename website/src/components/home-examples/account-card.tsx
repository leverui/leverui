import { Button, Card, Checkbox, Field, Input } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** A short sign-up form. */
export function AccountCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>Create your account</Card.Title>
      </Card.Header>
      <Card.Body>
        <div class="home-example-stack">
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input size="sm" type="email" placeholder="you@example.com" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input size="sm" type="password" placeholder="At least 8 characters" />
          </Field.Root>
          <Checkbox.Root size="sm" defaultChecked>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Email me product news</Checkbox.Label>
          </Checkbox.Root>
          <Button type="button" colorPalette="cyan" size="sm">
            Create account
          </Button>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
