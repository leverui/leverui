import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  DialogContent,
  DialogPositioner,
  DialogRoot,
  DialogTrigger,
  Portal,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from '../src';

/** Exercise a portalled Tooltip inside a modal Dialog layer. */
function NestedTooltipExample(): JSX.Element {
  return (
    <>
      <DialogRoot>
        <DialogTrigger data-testid="tooltip-dialog-trigger">Open dialog</DialogTrigger>
        <Portal>
          <DialogPositioner>
            <DialogContent data-testid="tooltip-dialog-content">
              <div style={{ padding: '90px' }}>
                <TooltipRoot openDelay={0} closeDelay={0} positioning={{ placement: 'right' }}>
                  <TooltipTrigger data-testid="nested-tooltip-trigger">Details</TooltipTrigger>
                  <Portal>
                    <TooltipPositioner>
                      <TooltipContent data-testid="nested-tooltip-content">
                        Nested details
                      </TooltipContent>
                    </TooltipPositioner>
                  </Portal>
                </TooltipRoot>
              </div>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>
    </>
  );
}

const meta = {
  title: 'Components/Tooltip Nested',
  component: NestedTooltipExample,
} satisfies Meta<typeof NestedTooltipExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Dialog: Story = {};
