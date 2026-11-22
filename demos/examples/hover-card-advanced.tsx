import { type JSX } from '@solidjs/web';
import {
  Button,
  CloseButton,
  Dialog,
  HStack,
  HoverCard,
  Link,
  LocaleProvider,
  Portal,
  Stack,
  Text,
} from '../../src';
import './hover-card-examples.css';

const people: Record<string, string> = {
  ananya: 'Ananya builds design systems.',
  jules: 'Jules works on accessibility.',
  nico: 'Nico writes the docs.',
};

/** Preview the current value from three triggers sharing one machine. */
export function HoverCardWithMultipleTriggers(): JSX.Element {
  return (
    <HoverCard.Root size="sm">
      <HStack gap="4">
        <HoverCard.Trigger
          value="ananya"
          asChild={
            /** Preserve the machine's hover and focus handlers on the link. */
            (getProps) => (
              <Link {...getProps()} href="#">
                @ananya
              </Link>
            )
          }
        />
        <HoverCard.Trigger
          value="jules"
          asChild={
            /** Preserve the machine's hover and focus handlers on the link. */
            (getProps) => (
              <Link {...getProps()} href="#">
                @jules
              </Link>
            )
          }
        />
        <HoverCard.Trigger
          value="nico"
          asChild={
            /** Preserve the machine's hover and focus handlers on the link. */
            (getProps) => (
              <Link {...getProps()} href="#">
                @nico
              </Link>
            )
          }
        />
      </HStack>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content class="hover-card-example-narrow">
            <HoverCard.Arrow />
            <HoverCard.Context>
              {
                /** Read the active trigger from the shared machine. */
                (api) => <Text textStyle="sm">{people[api().triggerValue ?? ''] ?? ''}</Text>
              }
            </HoverCard.Context>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}

/** Open the nested Hover Card from a modal dialog. */
export function HoverCardOpenFromDialog(): JSX.Element {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        asChild={
          /** Preserve dialog trigger semantics on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline">
              Open dialog
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger
              asChild={
                /** Preserve close behavior on the compact CloseButton. */
                (getProps) => <CloseButton {...getProps()} size="sm" />
              }
            />
            <Dialog.Header>
              <Dialog.Title>Hover card in a dialog</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
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
              </HoverCard.Root>
            </Dialog.Body>
            <Dialog.Footer />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

/** Render the preview with Arabic direction and translated product name. */
export function HoverCardRTL(): JSX.Element {
  return (
    <LocaleProvider locale="ar-AE">
      <HoverCard.Root>
        <HoverCard.Trigger class="hover-card-example-pointer">@leverui</HoverCard.Trigger>
        <Portal>
          <HoverCard.Positioner>
            <HoverCard.Content>
              <HoverCard.Arrow />
              <h4>واجهة المستخدم ليفر</h4>
              <p>مكتبة مكونات Solid الحديثة</p>
              <p>يجب أن يشير السهم بشكل صحيح إلى الزناد</p>
            </HoverCard.Content>
          </HoverCard.Positioner>
        </Portal>
      </HoverCard.Root>
    </LocaleProvider>
  );
}
