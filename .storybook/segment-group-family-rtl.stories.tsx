import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { LocaleProvider, SegmentGroup } from '../src';

/** Let the shared RTL locale drive Segment Group keyboard and layout direction. */
function RtlSegments(): JSX.Element {
  return (
    <>
      <LocaleProvider locale="ar-EG">
        <form data-testid="segment-rtl-form">
          <SegmentGroup.Root
            name="direction"
            aria-label="RTL direction"
            defaultValue="First"
            data-testid="segment-rtl-root"
          >
            <SegmentGroup.Indicator data-testid="segment-rtl-indicator" />
            <SegmentGroup.Items items={['First', 'Second', 'Third']} />
          </SegmentGroup.Root>
        </form>
      </LocaleProvider>
    </>
  );
}

const meta = {
  title: 'Components/Segment Group Family RTL',
  component: RtlSegments,
} satisfies Meta<typeof RtlSegments>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Rtl: Story = { render: RtlSegments };
