import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  HStack,
  Input,
  Progress,
  Stack,
  Switch,
  Tabs,
  Tag,
} from '../../../../src';
import { type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Two questions, the first one open. */
function AccordionDemo(): JSX.Element {
  return (
    <Accordion.Root size="sm" defaultValue={['shipping']} style={{ width: '100%' }}>
      <Accordion.Item value="shipping">
        <Accordion.ItemTrigger>
          <span style={{ flex: '1' }}>Shipping</span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Orders ship in two days.</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="returns">
        <Accordion.ItemTrigger>
          <span style={{ flex: '1' }}>Returns</span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
      </Accordion.Item>
    </Accordion.Root>
  );
}

/** One short status message. */
function AlertDemo(): JSX.Element {
  return (
    <Alert.Root status="info" colorPalette="cyan" size="sm">
      <Alert.Indicator />
      <Alert.Title>Update available</Alert.Title>
    </Alert.Root>
  );
}

/** A photo, a second photo, and initials. */
function AvatarDemo(): JSX.Element {
  return (
    <HStack gap="2">
      <Avatar.Root>
        <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
        <Avatar.Fallback name="Mara Ellison" />
      </Avatar.Root>
      <Avatar.Root>
        <Avatar.Image src="/demo-images/avatars/avatar-2.webp" />
        <Avatar.Fallback name="Theo Park" />
      </Avatar.Root>
      <Avatar.Root colorPalette="cyan">
        <Avatar.Fallback name="Iris Calder" />
      </Avatar.Root>
    </HStack>
  );
}

/** Three badges in different styles. */
function BadgeDemo(): JSX.Element {
  return (
    <HStack gap="2">
      <Badge>Default</Badge>
      <Badge colorPalette="cyan">New</Badge>
      <Badge variant="outline">Draft</Badge>
    </HStack>
  );
}

/** A primary and a secondary button. */
function ButtonDemo(): JSX.Element {
  return (
    <HStack gap="2">
      <Button size="sm">Save</Button>
      <Button size="sm" variant="outline">
        Cancel
      </Button>
    </HStack>
  );
}

/** A small card with a title and one line. */
function CardDemo(): JSX.Element {
  return (
    <Card.Root size="sm" style={{ width: '100%' }}>
      <Card.Body style={{ gap: '4px' }}>
        <Card.Title>House latte</Card.Title>
        <Card.Description>Espresso with steamed milk.</Card.Description>
      </Card.Body>
    </Card.Root>
  );
}

/** One checked box and one empty box. */
function CheckboxDemo(): JSX.Element {
  return (
    <Stack gap="2">
      <Checkbox.Root defaultChecked>
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Email me updates</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root>
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Text me updates</Checkbox.Label>
      </Checkbox.Root>
    </Stack>
  );
}

/** An empty text field with a hint. */
function InputDemo(): JSX.Element {
  return <Input size="sm" placeholder="Email address" aria-label="Email address" />;
}

/** A bar that is a little over half full. */
function ProgressDemo(): JSX.Element {
  return (
    <Progress.Root value={60} style={{ width: '100%' }}>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
}

/** A switch that is turned on. */
function SwitchDemo(): JSX.Element {
  return (
    <Switch.Root defaultChecked>
      <Switch.HiddenInput />
      <Switch.Control />
      <Switch.Label>Auto-save</Switch.Label>
    </Switch.Root>
  );
}

/** Three tabs, the first one selected. */
function TabsDemo(): JSX.Element {
  return (
    <Tabs.Root defaultValue="members" size="sm">
      <Tabs.List>
        <Tabs.Trigger value="members">Members</Tabs.Trigger>
        <Tabs.Trigger value="projects">Projects</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
}

/** A plain tag and one that can be removed. */
function TagDemo(): JSX.Element {
  return (
    <HStack gap="2">
      <Tag.Root>
        <Tag.Label>Design</Tag.Label>
      </Tag.Root>
      <Tag.Root>
        <Tag.Label>Frontend</Tag.Label>
        <Tag.EndElement>
          <Tag.CloseTrigger />
        </Tag.EndElement>
      </Tag.Root>
    </HStack>
  );
}

/** The first twelve overview demos, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  accordion: AccordionDemo,
  alert: AlertDemo,
  avatar: AvatarDemo,
  badge: BadgeDemo,
  button: ButtonDemo,
  card: CardDemo,
  checkbox: CheckboxDemo,
  input: InputDemo,
  progress: ProgressDemo,
  switch: SwitchDemo,
  tabs: TabsDemo,
  tag: TagDemo,
};
