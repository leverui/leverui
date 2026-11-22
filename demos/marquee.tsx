import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  MarqueeAutoFill,
  MarqueeReverseDirection,
  MarqueeVertical,
} from './examples/marquee-basic-examples';
import {
  MarqueeDiagonal,
  MarqueeMultiple,
  MarqueeNewsTicker,
  MarqueeRtl,
} from './examples/marquee-layout-examples';
import {
  MarqueeEdges,
  MarqueePauseOnInteraction,
  MarqueeWithSpeed,
} from './examples/marquee-motion-examples';
import { MarqueeImageGallery, MarqueeTestimonials } from './examples/marquee-showcase-examples';
import { MarqueeFiniteLoops, MarqueeStore } from './examples/marquee-state-examples';

export const meta = {
  component: MarqueeAutoFill,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description to one guide example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

const finiteLoopsNote = `\`\`\`tsx
<Marquee.Root
  loopCount={3}
  onLoopComplete={() => {
    /* handle loop completion */
  }}
  onComplete={() => {
    /* handle animation end */
  }}
>
  {/* Marquee.Item elements */}
</Marquee.Root>
\`\`\``;

export const AutoFill: Story = { name: 'AutoFill', render: MarqueeAutoFill };
export const ReverseDirection: Story = {
  name: 'ReverseDirection',
  render: MarqueeReverseDirection,
  parameters: guide(
    'Use the `reverse` prop on the `Marquee.Root` component to reverse the direction of the marquee.',
  ),
};
export const Vertical: Story = {
  name: 'Vertical',
  render: MarqueeVertical,
  parameters: guide(
    'To animate content along the Y axis, use the `side` prop and set it to `bottom`.',
  ),
};
export const WithSpeed: Story = {
  name: 'WithSpeed',
  render: MarqueeWithSpeed,
  parameters: guide('Use the `speed` prop to control the animation speed in pixels per second.'),
};
export const PauseOnInteraction: Story = {
  name: 'PauseOnInteraction',
  render: MarqueePauseOnInteraction,
  parameters: guide(
    'Use the `pauseOnInteraction` prop to pause the animation when the user hovers or focuses the marquee.',
  ),
};
export const Store: Story = {
  name: 'Store',
  render: MarqueeStore,
  parameters: guide(
    'Use the `Marquee.RootProvider` and `useMarquee` hook to provide the marquee instance to the component and control the animation state programmatically.',
  ),
};
export const FiniteLoops: Story = {
  name: 'FiniteLoops',
  render: MarqueeFiniteLoops,
  parameters: {
    guide: {
      description:
        'To loop the marquee a finite number of times, set the `loopCount` prop on `Marquee.Root`. Alternatively, use the `onLoopComplete` and `onComplete` callbacks to track the number of completed loops or when the animation fully finishes.',
      after: finiteLoopsNote,
    },
  },
};
export const Edges: Story = {
  name: 'Edges',
  render: MarqueeEdges,
  parameters: guide('Render the `Marquee.Edge` component to apply an edge fade.'),
};
export const Multiple: Story = {
  name: 'Multiple',
  render: MarqueeMultiple,
  parameters: guide("Here's an example of how to render alternating marquee components."),
};
export const Diagonal: Story = {
  name: 'Diagonal',
  render: MarqueeDiagonal,
  parameters: guide(
    "Here's an example of how to animate content diagonally using the marquee component.",
  ),
};
export const NewsTicker: Story = {
  name: 'NewsTicker',
  render: MarqueeNewsTicker,
  parameters: guide(
    "Here's an example of how to implement a news ticker with the marquee component.",
  ),
};
export const ImageGallery: Story = {
  name: 'ImageGallery',
  render: MarqueeImageGallery,
  parameters: guide(
    "Here's an example of a 3D perspective image gallery with multiple vertical marquees scrolling in alternating directions.",
  ),
};
export const Testimonials: Story = {
  name: 'Testimonials',
  render: MarqueeTestimonials,
  parameters: guide('You can display testimonials with the marquee component.'),
};
export const Rtl: Story = {
  name: 'Rtl',
  render: MarqueeRtl,
  parameters: guide(
    'The marquee component supports RTL (right-to-left) layouts. Wrap the component with `LocaleProvider` to enable RTL mode.',
  ),
};
