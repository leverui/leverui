import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Avatar, Button, Card, Heading, Stack } from '../../src';

const variants = ['subtle', 'outline', 'elevated'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

/** Compare the three Card variants with the same profile content. */
export function CardWithVariants(): JSX.Element {
  return (
    <Stack gap="4" direction="row" class="card-example-variants">
      <For each={variants}>
        {
          /** Render one profile card in a variant. */
          (variant) => (
            <Card.Root class="card-example-narrow" variant={variant}>
              <Card.Body class="card-example-body-gap">
                <Avatar.Root size="lg" shape="rounded">
                  <Avatar.Image src="/demo-images/avatars/avatar-2.webp" />
                  <Avatar.Fallback name="Saturday Run Club" />
                </Avatar.Root>
                <Card.Title class="card-example-title-bottom">Saturday Run Club</Card.Title>
                <Card.Description>
                  An easy 5 km run every Saturday at 8 am. All paces are welcome.
                </Card.Description>
              </Card.Body>
              <Card.Footer class="card-example-footer-end">
                <Button variant="outline">View</Button>
                <Button>Join</Button>
              </Card.Footer>
            </Card.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare the three Card sizes. */
export function CardWithSizes(): JSX.Element {
  return (
    <Stack>
      <For each={sizes}>
        {
          /** Render one Card at each size. */
          (size) => (
            <Card.Root size={size}>
              <Card.Header>
                <Heading size="md">Card size: {size}</Heading>
              </Card.Header>
              <Card.Body class="card-example-size-body">
                The padding and the text get bigger as the card size goes up.
              </Card.Body>
            </Card.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Show every public Card part for the guide's anatomy explorer. */
export function CardExplorerDemo(): JSX.Element {
  return (
    <Card.Root class="card-example-narrow">
      <Card.Header>
        <Heading size="sm">Profile</Heading>
      </Card.Header>
      <Card.Body class="card-example-body-gap">
        <Avatar.Root size="lg" shape="rounded">
          <Avatar.Image src="/demo-images/avatars/avatar-2.webp" />
          <Avatar.Fallback name="Saturday Run Club" />
        </Avatar.Root>
        <Card.Title>Saturday Run Club</Card.Title>
        <Card.Description>
          We meet every Saturday at 8 am for an easy 5 km run. All paces are welcome.
        </Card.Description>
      </Card.Body>
      <Card.Footer class="card-example-footer-end">
        <Button variant="outline" size="sm">
          View
        </Button>
        <Button size="sm">Join</Button>
      </Card.Footer>
    </Card.Root>
  );
}
