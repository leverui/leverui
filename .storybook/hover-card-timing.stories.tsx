import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  HoverCardContent,
  HoverCardPositioner,
  HoverCardRoot,
  HoverCardTrigger,
  Portal,
} from '../src';

/** Expose nonzero hover delays and top placement to a real browser. */
function HoverCardTimingExample(): JSX.Element {
  return (
    <>
      <div style={{ padding: '240px 0 0 400px' }}>
        <HoverCardRoot
          openDelay={600}
          closeDelay={400}
          positioning={{ placement: 'top' }}
          lazyMount
          unmountOnExit
        >
          <HoverCardTrigger data-testid="hover-timing-trigger">Preview timing</HoverCardTrigger>
          <Portal>
            <HoverCardPositioner data-testid="hover-timing-positioner">
              <HoverCardContent data-testid="hover-timing-content">
                Delayed member preview
              </HoverCardContent>
            </HoverCardPositioner>
          </Portal>
        </HoverCardRoot>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Hover Card Timing',
  component: HoverCardTimingExample,
} satisfies Meta<typeof HoverCardTimingExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
