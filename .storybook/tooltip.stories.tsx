import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  Portal,
  TooltipArrow,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
  type TooltipOpenChangeDetails,
} from '../src';

/** Exercise the primitive hover, keyboard, presence, and the default appearance. */
function TooltipExample(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  /** Reflect the machine's current state in a browser assertion target. */
  function updateOpen(details: TooltipOpenChangeDetails): void {
    setOpen(details.open);
  }

  return (
    <>
      <div style={{ padding: '140px' }}>
        <TooltipRoot openDelay={0} closeDelay={0} onOpenChange={updateOpen}>
          <TooltipTrigger data-testid="tooltip-trigger">Account</TooltipTrigger>
          <Portal>
            <TooltipPositioner data-testid="tooltip-positioner">
              <TooltipContent data-testid="tooltip-content">
                <TooltipArrow data-testid="tooltip-arrow" />
                Account settings
              </TooltipContent>
            </TooltipPositioner>
          </Portal>
        </TooltipRoot>
        <button type="button" data-testid="tooltip-outside">
          Outside
        </button>
        <output data-testid="tooltip-open">{String(open())}</output>
      </div>
    </>
  );
}

/** Exercise caller-controlled state, placement, and an interactive surface. */
function ControlledTooltip(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  /** Keep the external signal synchronized with the primitive. */
  function updateOpen(details: TooltipOpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Toggle the caller-owned Tooltip state from its external control. */
  function toggleOpen(): void {
    setOpen(!open());
  }

  return (
    <>
      <div style={{ padding: '140px' }}>
        <TooltipRoot
          open={open()}
          onOpenChange={updateOpen}
          interactive
          positioning={{ placement: 'right' }}
        >
          <TooltipTrigger data-testid="controlled-tooltip-trigger">More details</TooltipTrigger>
          <Portal>
            <TooltipPositioner>
              <TooltipContent data-testid="controlled-tooltip-content">
                <a href="#details" data-testid="controlled-tooltip-link">
                  Details
                </a>
              </TooltipContent>
            </TooltipPositioner>
          </Portal>
        </TooltipRoot>
        <button
          type="button"
          onClick={toggleOpen}
          data-testid="tooltip-toggle"
          style={{ display: 'block', 'margin-top': '120px' }}
        >
          Toggle
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Tooltip',
  component: TooltipExample,
} satisfies Meta<typeof TooltipExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
export const Controlled: Story = { render: ControlledTooltip };
