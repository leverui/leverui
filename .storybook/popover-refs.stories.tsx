import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Popover } from '../src';

/** Exercise selected-element and caller-owned Popover trigger refs. */
function PopoverRefExample(): JSX.Element {
  const [selectedTag, setSelectedTag] = createSignal('');
  const [parentTag, setParentTag] = createSignal('');
  const [childTag, setChildTag] = createSignal('');

  /** Observe the native anchor selected by the Trigger's `as` prop. */
  function captureSelected(element: HTMLAnchorElement): void {
    setSelectedTag(element.tagName);
  }

  /** Observe the caller's ref on an `asChild` Trigger. */
  function captureParent(element: Element): void {
    setParentTag(element.tagName);
  }

  /** Observe the native child ref composed with the caller's ref. */
  function captureChild(element: HTMLButtonElement): void {
    setChildTag(element.tagName);
  }

  return (
    <>
      <Popover.Root>
        <Popover.Trigger
          as="a"
          href="#selected-popover"
          ref={captureSelected}
          data-testid="popover-selected-trigger"
        >
          Open selected trigger
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content data-testid="popover-selected-content">
            <Popover.Title>Selected trigger details</Popover.Title>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
      <Popover.Root>
        <Popover.Trigger
          ref={captureParent}
          asChild={
            /** Keep the child's own ref beside the Trigger ref. */
            (getProps) => (
              <button
                type="button"
                data-testid="popover-child-trigger"
                {...getProps({ ref: captureChild })}
              >
                Open caller-owned trigger
              </button>
            )
          }
        />
        <Popover.Positioner>
          <Popover.Content data-testid="popover-child-content">
            <Popover.Title>Caller-owned trigger details</Popover.Title>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
      <output data-testid="popover-selected-ref">{selectedTag()}</output>
      <output data-testid="popover-parent-ref">{parentTag()}</output>
      <output data-testid="popover-child-ref">{childTag()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Popover Refs',
  component: PopoverRefExample,
} satisfies Meta<typeof PopoverRefExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
