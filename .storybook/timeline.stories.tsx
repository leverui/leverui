import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { TimelineCompositionExample } from './timeline-composition-example';
import { TimelineMainExample } from './timeline-main-example';
import { TimelineVariantsExample } from './timeline-variants-example';

/** Compose focused Timeline examples under the same public system provider. */
function TimelineContractExample(): JSX.Element {
  return (
    <>
      <TimelineMainExample />
      <TimelineVariantsExample />
      <TimelineCompositionExample />
    </>
  );
}

const meta = {
  title: 'Content/Timeline',
  component: TimelineContractExample,
} satisfies Meta<typeof TimelineContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
