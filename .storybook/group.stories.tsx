import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Button, Group, type GroupProps } from '../src';
import {
  GroupResponsiveAttachExample,
  GroupResponsiveDetachExample,
  GroupResponsiveRadiusExample,
} from './group-responsive-examples';
import './group-story.css';

type GetChildProps = Parameters<NonNullable<GroupProps['asChild']>>[0];

/** Render a Group through its native anchor child path. */
function renderGroupLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#group-target" data-testid="group-link">
      Group link
    </a>
  );
}

/** Exclude the marked separator from joined edges and stacking. */
function skipSeparator(child: Element): boolean {
  return child.getAttribute('data-separator') === 'yes';
}

/** Exercise Group variants, indexed children, native paths, and live updates. */
function GroupContractExample(): JSX.Element {
  const [vertical, setVertical] = createSignal(false);
  const [skipMiddle, setSkipMiddle] = createSignal(false);

  /** Record the native section supplied through Group's ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.groupRef = element.tagName.toLowerCase();
  }

  /** Switch orientation while retaining the same mounted items. */
  function toggleOrientation(): void {
    setVertical(!vertical());
  }

  /** Toggle an explicit skip marker on the middle child. */
  function toggleSkip(): void {
    setSkipMiddle(!skipMiddle());
  }

  return (
    <>
      <section data-testid="group-story">
        <Group data-testid="group-default">
          <Box class="group-story-item" data-testid="group-default-first">
            One
          </Box>
          <Box class="group-story-item" data-testid="group-default-last">
            Two
          </Box>
        </Group>
        <Group attached data-testid="group-attached">
          <Button variant="outline" data-testid="group-attached-first">
            First
          </Button>
          <Button variant="outline" data-testid="group-attached-middle">
            Middle
          </Button>
          <Button variant="outline" data-testid="group-attached-last">
            Last
          </Button>
        </Group>
        <Group orientation="vertical" attached data-testid="group-vertical">
          <Button variant="outline" data-testid="group-vertical-first">
            First
          </Button>
          <Button variant="outline" data-testid="group-vertical-last">
            Last
          </Button>
        </Group>
        <Group grow class="group-story-width-240" data-testid="group-grow">
          <Button data-testid="group-grow-first">First</Button>
          <Button data-testid="group-grow-last">Last</Button>
        </Group>
        <Group stacking="first-on-top" attached data-testid="group-first-on-top">
          <Button variant="outline" data-testid="group-stack-first">
            First
          </Button>
          <Button variant="outline" data-testid="group-stack-last">
            Last
          </Button>
        </Group>
        <Group stacking="last-on-top" attached data-testid="group-last-on-top">
          <Button variant="outline" data-testid="group-stack-last-first">
            First
          </Button>
          <Button variant="outline" data-testid="group-stack-last-last">
            Last
          </Button>
        </Group>
        <Group skip={skipSeparator} attached data-testid="group-skipped">
          <Button variant="outline" data-testid="group-skipped-first">
            First
          </Button>
          <span data-separator="yes" data-testid="group-separator">
            |
          </span>
          <Button variant="outline" data-testid="group-skipped-last">
            Last
          </Button>
        </Group>
        <Group attached data-testid="group-single">
          <Button variant="outline" data-testid="group-single-item">
            Only
          </Button>
        </Group>
        <Group
          orientation={{ base: 'horizontal', md: 'vertical' }}
          grow={{ base: false, md: true }}
          class="group-story-width-180"
          data-testid="group-responsive"
        >
          <Button>One</Button>
          <Button>Two</Button>
        </Group>
        <GroupResponsiveDetachExample />
        <GroupResponsiveAttachExample />
        <GroupResponsiveRadiusExample />
        <Group
          align="flex-start"
          justify="space-between"
          wrap="wrap"
          class="group-story-width-100"
          data-testid="group-aliases"
        >
          <Box class="group-story-wide-item">One</Box>
          <Box class="group-story-wide-item">Two</Box>
        </Group>
        <Group class="group-story-override" data-testid="group-css-override">
          <Button>One</Button>
          <Button>Two</Button>
        </Group>
        <Group unstyled data-testid="group-unstyled">
          <Button>One</Button>
          <Button>Two</Button>
        </Group>
        <button type="button" onClick={toggleOrientation} data-testid="group-toggle-orientation">
          Change orientation
        </button>
        <button type="button" onClick={toggleSkip} data-testid="group-toggle-skip">
          Change skip
        </button>
        <Group
          as="section"
          ref={markSection}
          attached
          orientation={vertical() ? 'vertical' : 'horizontal'}
          data-testid="group-reactive"
        >
          <Button variant="outline" data-testid="group-reactive-first">
            First
          </Button>
          <Button
            variant="outline"
            data-leverui-group-skip={skipMiddle() ? '' : undefined}
            data-testid="group-reactive-middle"
          >
            Middle
          </Button>
          <Button variant="outline" data-testid="group-reactive-last">
            Last
          </Button>
        </Group>
        <Group asChild={renderGroupLink} align="center" />
        <span id="group-target">Link target</span>
      </section>
    </>
  );
}

const meta = {
  title: 'Layout/Group',
  component: GroupContractExample,
} satisfies Meta<typeof GroupContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
