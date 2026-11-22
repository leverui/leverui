import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { TimelineBasic } from './examples/timeline-basic';
import { TimelineComposition } from './examples/timeline-composition';
import { TimelineAlternating, TimelineWithContentBefore } from './examples/timeline-layouts';
import { TimelineWithSizes, TimelineWithVariants } from './examples/timeline-matrices';

export const meta = {
  component: TimelineBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Alternating: Story = {
  render: TimelineAlternating,
  parameters: {
    guide: { description: "Here's an example of a timeline with alternating content." },
  },
};
export const Basic: Story = { render: TimelineBasic };
export const Composition: Story = {
  render: TimelineComposition,
  parameters: {
    guide: {
      description:
        "Here's an example of how to compose the timeline with other components to create a consistent-looking timeline.",
    },
  },
};
export const ContentBefore: Story = {
  render: TimelineWithContentBefore,
  parameters: {
    guide: {
      description: "Here's an example of a timeline with content before the timeline indicator.",
    },
  },
};
export const Sizes: Story = {
  render: TimelineWithSizes,
  parameters: { guide: { description: 'Use the `size` prop to change the size of the timeline.' } },
};
export const Variants: Story = {
  render: TimelineWithVariants,
  parameters: {
    guide: { description: 'Use the `variant` prop to change the variant of the timeline.' },
  },
};
