import { type JSX } from '@solidjs/web';
import { CheckIcon, XIcon } from '@lucide/solid';
import { Avatar, Button, Card, Field, HStack, Input, Stack, Strong, Text } from '../../src';

/** Show the team invitation card with two decisions. */
export function CardWithAvatar(): JSX.Element {
  return (
    <Card.Root class="card-example-narrow">
      <Card.Body>
        <HStack gap="3" class="card-example-inviter">
          <Avatar.Root>
            <Avatar.Image src="/demo-images/avatars/avatar-4.webp" />
            <Avatar.Fallback name="Jonah Reyes" />
          </Avatar.Root>
          <Stack gap="0">
            <Text textStyle="sm" class="card-example-inviter-name">
              Jonah Reyes
            </Text>
            <Text textStyle="sm" class="card-example-inviter-handle">
              @jonahreyes
            </Text>
          </Stack>
        </HStack>
        <Card.Description>
          <Strong class="card-example-inviter-strong">Jonah Reyes </Strong>wants to join your team.
          Approve or decline the request.
        </Card.Description>
      </Card.Body>
      <Card.Footer>
        <Button variant="subtle" colorPalette="red" class="card-example-action">
          <XIcon />
          Decline
        </Button>
        <Button variant="subtle" colorPalette="blue" class="card-example-action">
          <CheckIcon />
          Approve
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}

/** Render the signup form inside Card sections. */
export function CardWithForm(): JSX.Element {
  return (
    <Card.Root class="card-example-product">
      <Card.Header>
        <Card.Title>Create your account</Card.Title>
        <Card.Description>Enter your name to get started.</Card.Description>
      </Card.Header>
      <Card.Body>
        <Stack gap="4" class="card-example-form-fields">
          <Field.Root>
            <Field.Label>First name</Field.Label>
            <Input />
          </Field.Root>
          <Field.Root>
            <Field.Label>Last name</Field.Label>
            <Input />
          </Field.Root>
        </Stack>
      </Card.Body>
      <Card.Footer class="card-example-footer-end">
        <Button variant="outline">Cancel</Button>
        <Button variant="solid">Create account</Button>
      </Card.Footer>
    </Card.Root>
  );
}
