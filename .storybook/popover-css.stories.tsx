import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Popover, Portal } from '../src';
import './popover-css.css';

/** Expose responsive Popover parts and a consumer CSS class through a portal. */
function PopoverCssExample(): JSX.Element {
  return (
    <>
      <div style={{ display: 'flex', gap: '24px', padding: '100px' }}>
        <Popover.Root size={{ base: 'xs', md: 'lg' }} defaultOpen>
          <Popover.Trigger>Styled panel</Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content data-testid="popover-css-content" class="account-popover">
                <Popover.Arrow data-testid="popover-css-arrow" />
                <Popover.Header data-testid="popover-css-header">Account</Popover.Header>
                <Popover.Body data-testid="popover-css-body">Details</Popover.Body>
                <Popover.Footer data-testid="popover-css-footer">Done</Popover.Footer>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
        <Popover.Root defaultOpen unstyled>
          <Popover.Trigger>Unstyled panel</Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content data-testid="popover-css-unstyled">Plain panel</Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Popover CSS',
  component: PopoverCssExample,
} satisfies Meta<typeof PopoverCssExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
