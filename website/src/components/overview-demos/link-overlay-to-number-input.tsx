import {
  Card,
  HStack,
  Link,
  LinkBox,
  LinkOverlay,
  List,
  Listbox,
  Mark,
  Marquee,
  NativeSelect,
  NumberInput,
  Separator,
  Stack,
  Text,
  createListCollection,
} from '../../../../src';
import { For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HelperIcon, PopupSurface } from './shared';

const roles = createListCollection({
  items: [
    { label: 'Owner', value: 'owner' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
  ],
});

const perks = ['Free shipping', 'Easy returns', 'Open daily'] as const;

/** A card whose title link covers the whole card. */
function LinkOverlayDemo(): JSX.Element {
  return (
    <LinkBox style={{ width: '100%' }}>
      <Card.Root size="sm">
        <Card.Body style={{ gap: '4px' }}>
          <Card.Title>
            <LinkOverlay href="#">
              Theming workshop <i class="bi bi-arrow-right" aria-hidden="true" />
            </LinkOverlay>
          </Card.Title>
          <Card.Description>The whole card is one link.</Card.Description>
        </Card.Body>
      </Card.Root>
    </LinkBox>
  );
}

/** A link inside a sentence and a link with an icon. */
function LinkDemo(): JSX.Element {
  return (
    <Stack gap="2">
      <Text>
        Read the{' '}
        <Link href="#" variant="underline" colorPalette="cyan">
          shipping guide
        </Link>
      </Text>
      <Link href="#">
        Open the docs <i class="bi bi-arrow-right" aria-hidden="true" />
      </Link>
    </Stack>
  );
}

/** Three short bulleted items. */
function ListDemo(): JSX.Element {
  return (
    <List.Root>
      <List.Item>Create a project</List.Item>
      <List.Item>Invite your team</List.Item>
      <List.Item>Connect a domain</List.Item>
    </List.Root>
  );
}

/** Three options, the middle one selected. */
function ListboxDemo(): JSX.Element {
  return (
    <Listbox.Root collection={roles} defaultValue={['editor']} style={{ width: '100%' }}>
      <Listbox.Content>
        <Listbox.List>
          <For each={roles.items}>
            {/** Show one option with its check mark. */}
            {(role) => (
              <Listbox.Item item={role}>
                <Listbox.ItemText>{role.label}</Listbox.ItemText>
                <Listbox.ItemIndicator />
              </Listbox.Item>
            )}
          </For>
        </Listbox.List>
      </Listbox.Content>
    </Listbox.Root>
  );
}

/** The provider shows nothing itself. */
function LocaleProviderDemo(): JSX.Element {
  return <HelperIcon name="translate" />;
}

/** One highlighted phrase in a sentence. */
function MarkDemo(): JSX.Element {
  return (
    <Text style={{ 'text-align': 'center' }}>
      Orders placed{' '}
      <Mark variant="subtle" colorPalette="yellow">
        before 2 pm
      </Mark>{' '}
      ship the same day
    </Text>
  );
}

/** A still row of three short messages. */
function MarqueeDemo(): JSX.Element {
  return (
    <Marquee.Root
      paused
      spacing="1.5rem"
      style={{ width: '100%', '--lui-marquee-edge-color': 'var(--lui-colors-bg-subtle)' }}
    >
      <Marquee.Viewport>
        <Marquee.Content>
          <For each={perks}>
            {/** Show one message in the row. */}
            {(perk) => <Marquee.Item>{perk}</Marquee.Item>}
          </For>
        </Marquee.Content>
      </Marquee.Viewport>
      <Marquee.Edge side="end" />
    </Marquee.Root>
  );
}

/** A picture of an open menu with three actions. */
function MenuDemo(): JSX.Element {
  return (
    <PopupSurface width="150px">
      <Stack gap="1">
        <HStack gap="2">
          <i class="bi bi-pencil" aria-hidden="true" />
          <Text>Rename</Text>
        </HStack>
        <HStack gap="2">
          <i class="bi bi-copy" aria-hidden="true" />
          <Text>Duplicate</Text>
        </HStack>
        <Separator />
        <HStack gap="2">
          <i class="bi bi-trash" aria-hidden="true" />
          <Text>Delete</Text>
        </HStack>
      </Stack>
    </PopupSurface>
  );
}

/** A native select with a value chosen. */
function NativeSelectDemo(): JSX.Element {
  return (
    <NativeSelect.Root size="sm" style={{ width: '180px' }}>
      <NativeSelect.Field aria-label="Size">
        <option value="small">Small</option>
        <option value="medium" selected>
          Medium
        </option>
        <option value="large">Large</option>
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}

/** A number field with its step buttons. */
function NumberInputDemo(): JSX.Element {
  return (
    <NumberInput.Root size="sm" defaultValue={12} style={{ width: '140px' }}>
      <NumberInput.Control />
      <NumberInput.Input aria-label="Quantity" />
    </NumberInput.Root>
  );
}

/** The overview demos for link-overlay through number-input, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  'link-overlay': LinkOverlayDemo,
  link: LinkDemo,
  list: ListDemo,
  listbox: ListboxDemo,
  'locale-provider': LocaleProviderDemo,
  mark: MarkDemo,
  marquee: MarqueeDemo,
  menu: MenuDemo,
  'native-select': NativeSelectDemo,
  'number-input': NumberInputDemo,
};
