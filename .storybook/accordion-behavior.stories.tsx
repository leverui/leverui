import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Accordion, LocaleProvider } from '../src';

/** Render a labeled item for keyboard and render-strategy examples. */
function BehaviorItem(props: { value: string; disabled?: boolean }): JSX.Element {
  return (
    <Accordion.Item value={props.value} disabled={props.disabled}>
      <Accordion.ItemTrigger data-testid={`behavior-${props.value}`}>
        {props.value} trigger
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent data-testid={`behavior-${props.value}-content`}>
        <Accordion.ItemBody>{props.value} content</Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}

/** Expose RTL direction, focus callbacks, and enabled trigger order. */
function KeyboardBehaviorStory(): JSX.Element {
  const [focusChanges, setFocusChanges] = createSignal(0);

  /** Count focus changes emitted by the primitive's accordion machine. */
  function countFocusChange(): void {
    setFocusChanges(focusChanges() + 1);
  }

  return (
    <>
      <LocaleProvider locale="ar-AE">
        <div style={{ width: '360px', padding: '24px' }}>
          <output data-testid="accordion-focus-changes">{focusChanges()}</output>
          <Accordion.Root onFocusChange={countFocusChange}>
            <BehaviorItem value="first" />
            <BehaviorItem value="disabled" disabled />
            <BehaviorItem value="second" />
            <BehaviorItem value="last" />
          </Accordion.Root>
          <button type="button" data-testid="accordion-after-root">
            After accordion
          </button>
        </div>
      </LocaleProvider>
    </>
  );
}

/** Confirm a disabled machine prevents every item from opening. */
function DisabledRootStory(): JSX.Element {
  return (
    <>
      <Accordion.Root disabled>
        <BehaviorItem value="first" />
        <BehaviorItem value="second" />
      </Accordion.Root>
    </>
  );
}

/** Keep one item open and remove an exited lazy panel. */
function NoncollapsibleStory(): JSX.Element {
  return (
    <>
      <Accordion.Root collapsible={false} lazyMount unmountOnExit>
        <BehaviorItem value="first" />
        <BehaviorItem value="second" />
      </Accordion.Root>
    </>
  );
}

const meta = {
  title: 'Components/Accordion Behavior',
  component: KeyboardBehaviorStory,
} satisfies Meta<typeof KeyboardBehaviorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Keyboard: Story = { render: KeyboardBehaviorStory };
export const DisabledRoot: Story = { render: DisabledRootStory };
export const Noncollapsible: Story = { render: NoncollapsibleStory };
