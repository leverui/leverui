import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseTrigger,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverPositioner,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  Portal,
  type PopoverOpenChangeDetails,
} from '../src';

/** Exercise accessible parts, focus, dismissal, and default CSS. */
function PopoverExample(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  /** Expose the primitive's current open state for the browser specimen. */
  function updateOpen(details: PopoverOpenChangeDetails): void {
    setOpen(details.open);
  }

  return (
    <>
      <PopoverRoot onOpenChange={updateOpen}>
        <PopoverTrigger data-testid="popover-trigger">Open details</PopoverTrigger>
        <Portal>
          <PopoverPositioner data-testid="popover-positioner">
            <PopoverContent data-testid="popover-content">
              <PopoverArrow data-testid="popover-arrow" />
              <PopoverHeader data-testid="popover-header">
                <PopoverTitle data-testid="popover-title">Account details</PopoverTitle>
              </PopoverHeader>
              <PopoverBody data-testid="popover-body">
                <PopoverDescription data-testid="popover-description">
                  Edit your account name.
                </PopoverDescription>
                <input aria-label="Account name" data-testid="popover-input" />
              </PopoverBody>
              <PopoverFooter data-testid="popover-footer">
                <PopoverCloseTrigger data-testid="popover-close">Done</PopoverCloseTrigger>
              </PopoverFooter>
            </PopoverContent>
          </PopoverPositioner>
        </Portal>
      </PopoverRoot>
      <button type="button" data-testid="popover-outside">
        Outside
      </button>
      <output data-testid="popover-open">{String(open())}</output>
    </>
  );
}

/** Exercise small sizing, a custom anchor, and non-default placement. */
function PositionedPopover(): JSX.Element {
  return (
    <>
      <div style={{ padding: '220px' }}>
        <PopoverRoot size="xs" positioning={{ placement: 'right-start' }}>
          <PopoverAnchor data-testid="popover-anchor" style={{ width: '160px' }}>
            Anchor point
          </PopoverAnchor>
          <PopoverTrigger data-testid="popover-placed-trigger">Open placed details</PopoverTrigger>
          <Portal>
            <PopoverPositioner>
              <PopoverContent data-testid="popover-placed-content">
                <PopoverBody data-testid="popover-placed-body">Placed details</PopoverBody>
              </PopoverContent>
            </PopoverPositioner>
          </Portal>
        </PopoverRoot>
      </div>
    </>
  );
}

/** Keep the primitive's anchor behavior while honoring a caller's native style. */
function AnchorCssPopover(): JSX.Element {
  return (
    <>
      <PopoverRoot>
        <PopoverAnchor
          data-testid="popover-css-anchor"
          title="Custom anchor"
          style={{ color: 'rgb(1, 2, 3)' }}
        >
          Anchor
        </PopoverAnchor>
      </PopoverRoot>
    </>
  );
}

const meta = {
  title: 'Components/Popover',
  component: PopoverExample,
} satisfies Meta<typeof PopoverExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
export const Positioned: Story = { render: PositionedPopover };
export const AnchorCss: Story = { render: AnchorCssPopover };
