import {
  Avatar,
  Button,
  Group,
  Heading,
  Highlight,
  HStack,
  Icon,
  IconButton,
  Image,
  Kbd,
  Link,
  Stack,
  Text,
} from '../../../../src';
import { type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PopupSurface } from './shared';

const heart = 'M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z';

/** Three buttons joined at their edges. */
function GroupDemo(): JSX.Element {
  return (
    <Group attached>
      <Button size="sm" variant="outline">
        Day
      </Button>
      <Button size="sm" variant="outline">
        Week
      </Button>
      <Button size="sm" variant="outline">
        Month
      </Button>
    </Group>
  );
}

/** A section title. */
function HeadingDemo(): JSX.Element {
  return <Heading size="2xl">Account settings</Heading>;
}

/** A sentence with one word marked. */
function HighlightDemo(): JSX.Element {
  return (
    <Text textStyle="sm">
      <Highlight
        query="Thursday"
        markStyle={{ padding: '0 2px', background: 'var(--leverui-colors-orange-subtle)' }}
      >
        Your parcel arrives on Thursday.
      </Highlight>
    </Text>
  );
}

/** A picture of a hover card: a profile summary under a link. */
function HoverCardDemo(): JSX.Element {
  return (
    <Stack gap="1" align="center">
      <Link href="#" variant="underline">
        Mara Ellison
      </Link>
      <PopupSurface>
        <HStack gap="2">
          <Avatar.Root size="sm">
            <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
            <Avatar.Fallback name="Mara Ellison" />
          </Avatar.Root>
          <Text textStyle="xs">Product designer, joined 2024</Text>
        </HStack>
      </PopupSurface>
    </Stack>
  );
}

/** Three icon-only buttons in different styles. */
function IconButtonDemo(): JSX.Element {
  return (
    <HStack gap="2">
      <IconButton size="sm" aria-label="Search">
        <i class="bi bi-search" aria-hidden="true" />
      </IconButton>
      <IconButton size="sm" variant="outline" aria-label="Like">
        <i class="bi bi-heart" aria-hidden="true" />
      </IconButton>
      <IconButton size="sm" variant="ghost" aria-label="More">
        <i class="bi bi-three-dots" aria-hidden="true" />
      </IconButton>
    </HStack>
  );
}

/** One icon in three sizes. */
function IconDemo(): JSX.Element {
  return (
    <HStack gap="4">
      <Icon size="sm" viewBox="0 0 24 24">
        <path d={heart} fill="currentColor" />
      </Icon>
      <Icon size="lg" viewBox="0 0 24 24">
        <path d={heart} fill="currentColor" />
      </Icon>
      <Icon size="2xl" viewBox="0 0 24 24">
        <path d={heart} fill="currentColor" />
      </Icon>
    </HStack>
  );
}

/** A photo cropped to a rounded rectangle. */
function ImageDemo(): JSX.Element {
  return (
    <Image
      src="/demo-images/scenes/mountains.webp"
      alt=""
      fit="cover"
      style={{ width: '160px', height: '100px', 'border-radius': 'var(--leverui-radii-md)' }}
    />
  );
}

/** A two-key keyboard shortcut. */
function KbdDemo(): JSX.Element {
  return (
    <HStack gap="1">
      <Kbd>Ctrl</Kbd>+<Kbd>K</Kbd>
    </HStack>
  );
}

/** The overview demos for group through kbd, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  group: GroupDemo,
  heading: HeadingDemo,
  highlight: HighlightDemo,
  'hover-card': HoverCardDemo,
  'icon-button': IconButtonDemo,
  icon: IconDemo,
  image: ImageDemo,
  kbd: KbdDemo,
};
