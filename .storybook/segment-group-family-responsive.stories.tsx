import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { SegmentGroup } from '../src';

/** Let CSS media queries select sizes without changing machine state. */
function ResponsiveSegments(): JSX.Element {
  return (
    <>
      <form data-testid="segment-responsive-form">
        <SegmentGroup.Root
          name="responsive"
          aria-label="Responsive framework"
          defaultValue="Solid"
          size={{ base: 'xs', md: 'lg' }}
          data-testid="segment-responsive-root"
        >
          <SegmentGroup.Indicator data-testid="segment-responsive-indicator" />
          <SegmentGroup.Items items={['React', 'Solid', 'Vue']} />
        </SegmentGroup.Root>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Segment Group Family Responsive',
  component: ResponsiveSegments,
} satisfies Meta<typeof ResponsiveSegments>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Responsive: Story = { render: ResponsiveSegments };
