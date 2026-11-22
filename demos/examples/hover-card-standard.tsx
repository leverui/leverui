import { type JSX } from '@solidjs/web';
import { ChartLineIcon } from '@lucide/solid';
import { Avatar, HStack, HoverCard, Icon, Link, Portal, Stack, Text } from '../../src';
import './hover-card-examples.css';

/** Render the profile preview with its avatar and download count. */
export function HoverCardBasic(): JSX.Element {
  return (
    <HoverCard.Root size="sm">
      <HoverCard.Trigger
        asChild={
          /** Preserve the machine's hover and focus handlers on the link. */
          (getProps) => (
            <Link {...getProps()} href="#">
              @leverui
            </Link>
          )
        }
      />
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <HoverCard.Arrow />
            <Stack gap="4" direction="row">
              <Avatar.Root>
                <Avatar.Fallback name="Lever UI" />
              </Avatar.Root>
              <Stack gap="3">
                <Stack gap="1">
                  <Text textStyle="sm" class="example-hover-card-title">
                    Lever UI
                  </Text>
                  <Text textStyle="sm" class="example-hover-card-description">
                    Accessible components for SolidJS apps, styled with plain CSS.
                  </Text>
                </Stack>
                <HStack class="example-hover-card-stats">
                  <Icon size="sm">
                    <ChartLineIcon />
                  </Icon>
                  <Text textStyle="xs">2.5M downloads</Text>
                </HStack>
              </Stack>
            </Stack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}

/** Keep the card closed on hover and focus while the root is disabled. */
export function HoverCardWithDisabled(): JSX.Element {
  return (
    <HoverCard.Root size="sm" disabled>
      <HoverCard.Trigger
        asChild={
          /** Preserve the machine's hover and focus handlers on the link. */
          (getProps) => (
            <Link {...getProps()} href="#">
              @leverui
            </Link>
          )
        }
      />
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <HoverCard.Arrow />
            <Stack gap="1">
              <Text textStyle="sm" class="example-hover-card-title">
                Lever UI
              </Text>
              <Text textStyle="sm" class="example-hover-card-description">
                Accessible components for SolidJS apps, styled with plain CSS.
              </Text>
            </Stack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}

/** Keep the anatomy explorer's card open without a portal. */
export function HoverCardExplorerDemo(): JSX.Element {
  return (
    <HoverCard.Root size="sm" open>
      <HoverCard.Trigger
        asChild={
          /** Preserve the machine's hover and focus handlers on the link. */
          (getProps) => (
            <Link {...getProps()} href="#">
              @leverui
            </Link>
          )
        }
      />
      <HoverCard.Positioner>
        <HoverCard.Content>
          <HoverCard.Arrow />
          <Stack gap="4" direction="row">
            <Avatar.Root>
              <Avatar.Fallback name="Lever UI" />
            </Avatar.Root>
            <Stack gap="3">
              <Stack gap="1">
                <Text textStyle="sm" class="example-hover-card-title">
                  Lever UI
                </Text>
                <Text textStyle="sm" class="example-hover-card-description">
                  Accessible components for SolidJS apps, styled with plain CSS.
                </Text>
              </Stack>
              <HStack class="example-hover-card-stats">
                <Icon size="sm">
                  <ChartLineIcon />
                </Icon>
                <Text textStyle="xs">2.5M downloads</Text>
              </HStack>
            </Stack>
          </Stack>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  );
}
