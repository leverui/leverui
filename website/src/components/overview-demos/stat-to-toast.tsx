import {
  Badge,
  Button,
  HStack,
  Stack,
  Stat,
  Status,
  Steps,
  Table,
  TagsInput,
  Text,
  Textarea,
  Theme,
  Timeline,
} from '../../../../src';
import { type Component, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PopupSurface } from './shared';

/** A labeled number with its change since last week. */
function StatDemo(): JSX.Element {
  return (
    <Stat.Root size="sm">
      <Stat.Label>Unique visitors</Stat.Label>
      <HStack gap="2">
        <Stat.ValueText>192.1k</Stat.ValueText>
        <Badge colorPalette="green">
          <Stat.UpIndicator />
          12%
        </Badge>
      </HStack>
    </Stat.Root>
  );
}

/** Three colored dots with their labels. */
function StatusDemo(): JSX.Element {
  return (
    <HStack gap="4">
      <Status.Root colorPalette="green">
        <Status.Indicator />
        Online
      </Status.Root>
      <Status.Root colorPalette="orange">
        <Status.Indicator />
        Away
      </Status.Root>
      <Status.Root colorPalette="red">
        <Status.Indicator />
        Offline
      </Status.Root>
    </HStack>
  );
}

/** Three steps: the first done and the second current. */
function StepsDemo(): JSX.Element {
  return (
    <Steps.Root
      size="xs"
      defaultValue="profile"
      defaultCompletedValues={['account']}
      items={[{ value: 'account' }, { value: 'profile' }, { value: 'review' }]}
    >
      <Steps.List>
        <For each={['account', 'profile', 'review']}>
          {/** Draw one numbered step and the line after it. */}
          {(value) => (
            <Steps.Item value={value}>
              <Steps.Indicator />
              <Steps.Separator />
            </Steps.Item>
          )}
        </For>
      </Steps.List>
    </Steps.Root>
  );
}

/** A header row and two rows of people. */
function TableDemo(): JSX.Element {
  return (
    <Table.Root size="sm">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader>Role</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Mara Ellison</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Theo Park</Table.Cell>
          <Table.Cell>Editor</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

/** A field that holds two tags and room for one more. */
function TagsInputDemo(): JSX.Element {
  return (
    <TagsInput.Root size="sm" defaultValue={['Design', 'Docs']} style={{ width: '100%' }}>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Add tag" aria-label="Tags" />
      </TagsInput.Control>
    </TagsInput.Root>
  );
}

/** The same kind of text in three sizes. */
function TextDemo(): JSX.Element {
  return (
    <Stack gap="1">
      <Text textStyle="xl">Large text</Text>
      <Text textStyle="md">Medium text</Text>
      <Text textStyle="xs">Small text</Text>
    </Stack>
  );
}

/** An empty comment box with a hint. */
function TextareaDemo(): JSX.Element {
  return <Textarea size="sm" rows={3} placeholder="Leave a comment" aria-label="Comment" />;
}

/** One panel forced to light mode beside one forced to dark mode. */
function ThemeDemo(): JSX.Element {
  return (
    <HStack gap="3">
      <Theme appearance="light" style={{ padding: '12px', 'border-radius': '6px' }}>
        <Button size="xs" variant="surface">
          Light
        </Button>
      </Theme>
      <Theme appearance="dark" style={{ padding: '12px', 'border-radius': '6px' }}>
        <Button size="xs" variant="surface">
          Dark
        </Button>
      </Theme>
    </HStack>
  );
}

/** Three events joined by a line. */
function TimelineDemo(): JSX.Element {
  return (
    <Timeline.Root size="sm" style={{ width: 'auto' }}>
      <For each={['Order placed', 'Order shipped', 'Order delivered']}>
        {/** Draw one event with its marker. */}
        {(title) => (
          <Timeline.Item>
            <Timeline.Connector>
              <Timeline.Separator />
              <Timeline.Indicator />
            </Timeline.Connector>
            <Timeline.Content>
              <Timeline.Title>{title}</Timeline.Title>
            </Timeline.Content>
          </Timeline.Item>
        )}
      </For>
    </Timeline.Root>
  );
}

/** A static picture of a success toast. */
function ToastDemo(): JSX.Element {
  return (
    <PopupSurface width="100%">
      <HStack gap="3" align="flex-start">
        <i class="bi bi-check-circle-fill" aria-hidden="true" />
        <Stack gap="0" style={{ flex: '1' }}>
          <Text textStyle="label">File saved</Text>
          <Text textStyle="xs">Your changes are live.</Text>
        </Stack>
        <i class="bi bi-x" aria-hidden="true" />
      </HStack>
    </PopupSurface>
  );
}

/** The overview demos for stat through toast, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  stat: StatDemo,
  status: StatusDemo,
  steps: StepsDemo,
  table: TableDemo,
  'tags-input': TagsInputDemo,
  text: TextDemo,
  textarea: TextareaDemo,
  theme: ThemeDemo,
  timeline: TimelineDemo,
  toast: ToastDemo,
};
