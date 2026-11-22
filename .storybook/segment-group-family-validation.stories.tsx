import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { SegmentGroup } from '../src';

/** Show native required form behavior and machine invalid state. */
function ValidationSegments(): JSX.Element {
  return (
    <>
      <form data-testid="segment-validation-form">
        <SegmentGroup.Root name="required" aria-label="Required choice" required>
          <SegmentGroup.Items items={['First', 'Second']} />
        </SegmentGroup.Root>
        <SegmentGroup.Root name="invalid" aria-label="Invalid choice" invalid defaultValue="First">
          <SegmentGroup.Items items={['First', 'Second']} />
        </SegmentGroup.Root>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Segment Group Family Validation',
  component: ValidationSegments,
} satisfies Meta<typeof ValidationSegments>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Validation: Story = { render: ValidationSegments };
