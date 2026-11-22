import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardPositioner,
  HoverCardRoot,
  HoverCardTrigger,
  Portal,
  type HoverCardOpenChangeDetails,
} from '../src';

/** Exercise native parts, default sizing, hover state, and an interactive card. */
function HoverCardExample(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  /** Expose the primitive's open state for the browser contract check. */
  function updateOpen(details: HoverCardOpenChangeDetails): void {
    setOpen(details.open);
  }

  return (
    <>
      <HoverCardRoot openDelay={0} closeDelay={0} lazyMount unmountOnExit onOpenChange={updateOpen}>
        <HoverCardTrigger data-testid="hover-trigger">Preview member</HoverCardTrigger>
        <Portal>
          <HoverCardPositioner data-testid="hover-positioner">
            <HoverCardContent data-testid="hover-content">
              <HoverCardArrow data-testid="hover-arrow" />
              <strong>Lever UI member</strong>
              <a href="#member-profile">Read profile</a>
            </HoverCardContent>
          </HoverCardPositioner>
        </Portal>
      </HoverCardRoot>
      <output data-testid="hover-open">{String(open())}</output>
    </>
  );
}

const meta = {
  title: 'Components/Hover Card',
  component: HoverCardExample,
} satisfies Meta<typeof HoverCardExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
