import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { PresenceLazyMount, PresenceUnmountOnExit } from './examples/presence-mounting';
import {
  PresenceFade,
  PresenceScaleFade,
  PresenceSlide,
  PresenceSlideFade,
} from './examples/presence-motion';

export const meta = {
  component: PresenceFade,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description to one example. */
function guide(description: string): Story['parameters'] {
  return {
    guide: { description },
  };
}

export const Basic: Story = { render: PresenceFade };
export const Fade: Story = {
  render: PresenceFade,
  parameters: guide(
    'Setting the animation name to `fade-in` and `fade-out`, the component will animate the entry and exit of the element.',
  ),
};
export const ScaleFade: Story = {
  render: PresenceScaleFade,
  parameters: guide(
    'Using the animation names `scale-in` and `fade-in`, then `scale-out` and `fade-out`, the component will animate the entry and exit of the element.',
  ),
};
export const SlideFade: Story = {
  render: PresenceSlideFade,
  parameters: guide(
    "Here's an example that uses the animation names `slide-from-bottom` and `slide-to-bottom` to animate the entry and exit of the element.",
  ),
};
export const Slide: Story = {
  render: PresenceSlide,
  parameters: guide(
    "Here's an example that uses the animation names `slide-from-bottom-full` and `slide-to-bottom-full` to animate the entry and exit of the element.",
  ),
};
export const LazyMount: Story = {
  render: PresenceLazyMount,
  parameters: guide(
    "Use the `lazyMount` prop to delay the mount of the component until it's present.",
  ),
};
export const UnmountOnExit: Story = {
  render: PresenceUnmountOnExit,
  parameters: guide("Use the `unmountOnExit` prop to unmount the component when it's not present."),
};
