import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { HoverCard, Portal } from '../src';
import './hover-card-css.css';

/** Expose responsive sizing and consumer CSS overrides in a portalled card. */
function HoverCardCssExample(): JSX.Element {
  return (
    <>
      <div style={{ display: 'flex', gap: '24px', padding: '100px' }}>
        <HoverCard.Root size={{ base: 'xs', md: 'lg' }} defaultOpen>
          <HoverCard.Trigger>Styled preview</HoverCard.Trigger>
          <Portal>
            <HoverCard.Positioner>
              <HoverCard.Content data-testid="hover-css-content" class="profile-preview">
                <HoverCard.Arrow data-testid="hover-css-arrow" />
                Member profile
              </HoverCard.Content>
            </HoverCard.Positioner>
          </Portal>
        </HoverCard.Root>
        <HoverCard.Root defaultOpen unstyled>
          <HoverCard.Trigger>Unstyled preview</HoverCard.Trigger>
          <Portal>
            <HoverCard.Positioner>
              <HoverCard.Content data-testid="hover-css-unstyled">Plain profile</HoverCard.Content>
            </HoverCard.Positioner>
          </Portal>
        </HoverCard.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Hover Card CSS',
  component: HoverCardCssExample,
} satisfies Meta<typeof HoverCardCssExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
