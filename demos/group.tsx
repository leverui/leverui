import { type JSX } from '@solidjs/web';
import type { Demo, DemoMeta } from './demo-types';
import { Badge, Box, Button, Group } from '../src';
import { groupAttachedNote } from './group-attached-note';
import { withComponentInset } from './examples/example-frame';
import './group-examples.css';

/** Group two patterned boxes with the default spacing. */
function GroupBasic(): JSX.Element {
  return (
    <Group>
      <Box class="group-example-pattern">1</Box>
      <Box class="group-example-pattern">2</Box>
    </Group>
  );
}

/** Group two outline buttons without joining their edges. */
function GroupWithButton(): JSX.Element {
  return (
    <Group>
      <Button variant="outline">Item 1</Button>
      <Button variant="outline">Item 2</Button>
    </Group>
  );
}

/** Join buttons and badges in separate groups. */
function GroupWithAttached(): JSX.Element {
  return (
    <div class="group-example-stack">
      <Group attached>
        <Button variant="outline">Item 1</Button>
        <Button variant="outline">Item 2</Button>
      </Group>
      <Group attached>
        <Badge variant="solid" colorPalette="purple">
          Test coverage
        </Badge>
        <Badge variant="solid" colorPalette="green">
          94%
        </Badge>
      </Group>
    </div>
  );
}

/** Give three outline buttons equal space within their group. */
function GroupWithGrow(): JSX.Element {
  return (
    <Group grow class="group-example-grow">
      <Button variant="outline">First</Button>
      <Button variant="outline">Second</Button>
      <Button variant="outline">Third</Button>
    </Group>
  );
}

export const meta = {
  component: GroupBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = {
  render: GroupBasic,
};

export const WithButton: Story = {
  name: 'Button',
  render: GroupWithButton,
  parameters: {
    guide: {
      description: "Here's an example of using the `Group` component to group buttons together.",
    },
  },
};

export const Attached: Story = {
  render: GroupWithAttached,
  parameters: {
    guide: {
      description: 'Use the `attached` prop to attach the children together.',
      after: groupAttachedNote,
    },
  },
};

export const Grow: Story = {
  render: GroupWithGrow,
  parameters: {
    guide: {
      description: 'Use the `grow` prop to make the children grow to fill the available space.',
    },
  },
};
