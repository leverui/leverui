import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  PopoverBody,
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
  Portal,
} from '../src';

/** Exercise nested Popover layers through separate primitive machines. */
function NestedPopoverExample(): JSX.Element {
  return (
    <>
      <PopoverRoot>
        <PopoverTrigger data-testid="nested-popover-trigger">Open parent</PopoverTrigger>
        <Portal>
          <PopoverPositioner>
            <PopoverContent data-testid="nested-parent-content">
              <PopoverBody>
                Parent content
                <PopoverRoot size="sm">
                  <PopoverTrigger data-testid="nested-child-trigger">Open child</PopoverTrigger>
                  <Portal>
                    <PopoverPositioner>
                      <PopoverContent data-testid="nested-child-content">
                        <PopoverBody data-testid="nested-child-body">Child content</PopoverBody>
                      </PopoverContent>
                    </PopoverPositioner>
                  </Portal>
                </PopoverRoot>
              </PopoverBody>
            </PopoverContent>
          </PopoverPositioner>
        </Portal>
      </PopoverRoot>
    </>
  );
}

const meta = {
  title: 'Components/Popover Nested',
  component: NestedPopoverExample,
} satisfies Meta<typeof NestedPopoverExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nested: Story = {};
