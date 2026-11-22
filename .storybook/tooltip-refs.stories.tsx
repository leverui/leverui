import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Tooltip } from '../src';

/** Exercise selected and caller-owned Tooltip trigger refs and semantics. */
function TooltipRefsExample(): JSX.Element {
  const [selectedTag, setSelectedTag] = createSignal('');
  const [parentTag, setParentTag] = createSignal('');
  const [childTag, setChildTag] = createSignal('');

  /** Observe the anchor selected by the Trigger's `as` prop. */
  function captureSelected(element: HTMLAnchorElement): void {
    setSelectedTag(element.tagName);
  }

  /** Observe the caller's ref on an `asChild` Trigger. */
  function captureParent(element: Element): void {
    setParentTag(element.tagName);
  }

  /** Observe the child ref composed with the caller's ref. */
  function captureChild(element: HTMLButtonElement): void {
    setChildTag(element.tagName);
  }

  return (
    <>
      <div style={{ padding: '100px', display: 'flex', gap: '100px' }}>
        <Tooltip.Root openDelay={0} closeDelay={0}>
          <Tooltip.Trigger
            as="a"
            href="#selected-tooltip"
            ref={captureSelected}
            data-testid="tooltip-selected-trigger"
          >
            Selected trigger
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content data-testid="tooltip-selected-content">
              Selected details
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
        <Tooltip.Root openDelay={0} closeDelay={0}>
          <Tooltip.Trigger
            ref={captureParent}
            asChild={
              /** Keep the native child's ref beside the Trigger ref. */
              (getProps) => (
                <button
                  type="button"
                  data-testid="tooltip-child-trigger"
                  {...getProps({ ref: captureChild })}
                >
                  Caller-owned trigger
                </button>
              )
            }
          />
          <Tooltip.Positioner>
            <Tooltip.Content data-testid="tooltip-child-content">Child details</Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
        <Tooltip.Root aria-label="Named tooltip" openDelay={0}>
          <Tooltip.Trigger data-testid="tooltip-labelled-trigger">Named trigger</Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content data-testid="tooltip-labelled-content">Named details</Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      </div>
      <output data-testid="tooltip-selected-ref">{selectedTag()}</output>
      <output data-testid="tooltip-parent-ref">{parentTag()}</output>
      <output data-testid="tooltip-child-ref">{childTag()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Tooltip Refs',
  component: TooltipRefsExample,
} satisfies Meta<typeof TooltipRefsExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
