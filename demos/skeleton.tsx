import type { Demo, DemoMeta } from './demo-types';
import {
  SkeletonBasic,
  SkeletonForFeed,
  SkeletonForText,
  SkeletonWithVariants,
} from './examples/skeleton-placeholders';
import {
  SkeletonTextWithChildren,
  SkeletonWithChildren,
  SkeletonWithLoaded,
  SkeletonWithStartEndColor,
} from './examples/skeleton-content';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: SkeletonBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: SkeletonBasic };
export const Feed: Story = {
  render: SkeletonForFeed,
  parameters: {
    guide: { description: 'Use the `Skeleton` component to create a feed skeleton.' },
  },
};
export const Text: Story = {
  render: SkeletonForText,
  parameters: {
    guide: { description: 'Use the `SkeletonText` component to create a skeleton for text.' },
  },
};
export const TextWithChildren: Story = { render: SkeletonTextWithChildren };
export const WithChildren: Story = {
  render: SkeletonWithChildren,
  parameters: {
    guide: {
      description: 'Use the `loading` prop to show the skeleton while the content is loading.',
    },
  },
};
export const WithLoaded: Story = {
  render: SkeletonWithLoaded,
  parameters: {
    guide: {
      description: 'When `loading` is changed to `false`, the Skeleton component will fade in.',
    },
  },
};
export const StartEndColor: Story = {
  render: SkeletonWithStartEndColor,
  parameters: {
    guide: {
      description:
        'Use the `--leverui-skeleton-start-color` and `--leverui-skeleton-end-color` CSS variables to change the start and end color of the skeleton.',
    },
  },
};
export const Variants: Story = {
  render: SkeletonWithVariants,
  parameters: {
    guide: { description: 'Use the `variant` prop to change the visual style of the Skeleton.' },
  },
};
