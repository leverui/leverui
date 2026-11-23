import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button, ButtonGroup, Group } from '../src';
import './group-story.css';

/** Skip direct children that currently carry the separator marker. */
function skipSeparator(child: Element): boolean | undefined {
  return child.getAttribute('data-separator') === 'yes' ? true : undefined;
}

/** Exercise focus selection, SVG indexing, and reactive predicate attributes. */
function GroupRegressionsExample(): JSX.Element {
  const [separator, setSeparator] = createSignal(false);
  const [section, setSection] = createSignal(false);

  /** Change an existing child's attribute without replacing its node. */
  function toggleSeparator(): void {
    setSeparator(!separator());
  }

  /** Replace the native Group root to exercise observer rebinding. */
  function toggleRoot(): void {
    setSection(!section());
  }

  return (
    <>
      <Group data-testid="focus-group">
        <button type="button" data-testid="focus-first">
          First
        </button>
        <button type="button" data-lui-group-skip data-testid="focus-skipped">
          Skipped
        </button>
        <button type="button" data-testid="focus-last">
          Last
        </button>
      </Group>
      <Group data-testid="focus-single">
        <button type="button" data-testid="focus-only">
          Only
        </button>
      </Group>
      <Group skip={skipSeparator} data-testid="svg-group">
        <svg data-testid="svg-first" width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" />
        </svg>
        <svg data-testid="svg-last" width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" />
        </svg>
      </Group>
      <button type="button" onClick={toggleSeparator} data-testid="toggle-separator">
        Toggle separator
      </button>
      <Group skip={skipSeparator} data-testid="reactive-skip-group">
        <button type="button" data-testid="reactive-skip-first">
          First
        </button>
        <span data-separator={separator() ? 'yes' : 'no'} data-testid="reactive-separator">
          |
        </span>
        <button type="button" data-testid="reactive-skip-last">
          Last
        </button>
      </Group>
      <Group skip={skipSeparator} data-testid="math-group">
        <math data-testid="math-first">
          <mi>x</mi>
        </math>
        <math data-separator="yes" data-testid="math-skipped">
          <mi>y</mi>
        </math>
        <button type="button" data-testid="math-last">
          Last
        </button>
      </Group>
      <button type="button" onClick={toggleRoot} data-testid="toggle-root">
        Toggle root
      </button>
      <Group as={section() ? 'section' : 'div'} data-testid="changing-root">
        <button type="button" data-testid="changing-first">
          First
        </button>
        <button type="button" data-testid="changing-last">
          Last
        </button>
      </Group>
      <Group data-testid="move-source">
        <button type="button" data-testid="move-first">
          First
        </button>
        <button type="button" data-testid="move-child">
          Move me
        </button>
      </Group>
      <div data-testid="move-outside" />
      <Group data-testid="move-target">
        <button type="button" data-testid="move-target-first">
          Target
        </button>
      </Group>
    </>
  );
}

/** Put three Buttons in a ButtonGroup that is narrower than their labels. */
function GroupNarrowButtonsExample(): JSX.Element {
  return (
    <div class="group-story-narrow-column">
      <ButtonGroup size="sm" variant="outline" data-testid="narrow-group">
        <Button>Add message</Button>
        <Button>Add 5 messages</Button>
        <Button>Remove message</Button>
      </ButtonGroup>
    </div>
  );
}

const meta = {
  title: 'Layout/Group Regressions',
  component: GroupRegressionsExample,
} satisfies Meta<typeof GroupRegressionsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
export const NarrowButtons: Story = { render: GroupNarrowButtonsExample };
