import { type JSX } from '@solidjs/web';
import { Avatar, Badge, Box, Button, Card, HStack, Image, Text } from '../../src';

/** Show the profile card with an Avatar and two actions. */
export function CardBasic(): JSX.Element {
  return (
    <Card.Root class="card-example-narrow">
      <Card.Body class="card-example-body-gap">
        <Avatar.Root size="lg" shape="rounded">
          <Avatar.Image src="/demo-images/avatars/avatar-2.webp" />
          <Avatar.Fallback name="Saturday Run Club" />
        </Avatar.Root>
        <Card.Title class="card-example-title-top">Saturday Run Club</Card.Title>
        <Card.Description>
          We meet every Saturday at 8 am for an easy 5 km run. All paces are welcome, and we get
          coffee afterwards.
        </Card.Description>
      </Card.Body>
      <Card.Footer class="card-example-footer-end">
        <Button variant="outline">View</Button>
        <Button>Join</Button>
      </Card.Footer>
    </Card.Root>
  );
}

/** Show the image-led sofa product card. */
export function CardWithImage(): JSX.Element {
  return (
    <Card.Root class="card-example-product">
      <Image src="/demo-images/scenes/sofa.webp" alt="Green two-seat sofa in a living room" />
      <Card.Body class="card-example-body-gap">
        <Card.Title>Green two-seat sofa</Card.Title>
        <Card.Description>
          Deep cushions and wooden legs. It fits well in a small living room.
        </Card.Description>
        <Text textStyle="2xl" class="card-example-price">
          $389
        </Text>
      </Card.Body>
      <Card.Footer class="card-example-footer-gap">
        <Button variant="solid">Buy now</Button>
        <Button variant="ghost">Add to cart</Button>
      </Card.Footer>
    </Card.Root>
  );
}

/** Arrange the coffee product card horizontally. */
export function CardHorizontal(): JSX.Element {
  return (
    <Card.Root class="card-example-horizontal">
      <Image
        class="card-example-horizontal-image"
        src="/demo-images/scenes/latte.webp"
        alt="Latte with leaf art in a white cup"
      />
      <Box>
        <Card.Body>
          <Card.Title class="card-example-title-bottom">House latte</Card.Title>
          <Card.Description>
            A latte is a shot of espresso topped with steamed milk.
          </Card.Description>
          <HStack class="card-example-badges">
            <Badge>Hot</Badge>
            <Badge>Caffeine</Badge>
          </HStack>
        </Card.Body>
        <Card.Footer>
          <Button>Buy latte</Button>
        </Card.Footer>
      </Box>
    </Card.Root>
  );
}
