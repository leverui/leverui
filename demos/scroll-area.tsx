import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  ScrollAreaScrollToPosition,
  ScrollAreaScrollToSide,
} from './examples/scroll-area-controls';
import { ScrollAreaStickToBottom } from './examples/scroll-area-stick-to-bottom';
import { ScrollAreaWithMenu } from './examples/scroll-area-menu';
import {
  ScrollAreaWithStore,
  ScrollAreaWithThumbStyling,
  ScrollAreaWithVariants,
} from './examples/scroll-area-styles';
import {
  ScrollAreaBasic,
  ScrollAreaBothDirections,
  ScrollAreaHorizontal,
  ScrollAreaWithRtl,
  ScrollAreaWithScrollShadow,
  ScrollAreaWithSizes,
} from './examples/scroll-area-surfaces';
import { ScrollAreaVirtualization } from './examples/scroll-area-virtualization';

export const meta = {
  component: ScrollAreaBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: ScrollAreaBasic };
export const BothDirections: Story = {
  name: 'BothDirections',
  render: ScrollAreaBothDirections,
  parameters: {
    guide: {
      description: 'When content overflows in both directions, both scrollbars will appear.',
      after:
        '> You can render `ScrollArea.Corner` to show a corner indicator at the intersection of the two scrollbars for a seamless, styled appearance.',
    },
  },
};
export const Horizontal: Story = {
  render: ScrollAreaHorizontal,
  parameters: {
    guide: {
      description:
        'The scroll area automatically supports horizontal scrolling when content overflows horizontally.',
    },
  },
};
export const ScrollToPosition: Story = {
  name: 'ScrollToPosition',
  render: ScrollAreaScrollToPosition,
  parameters: {
    guide: {
      description:
        'Jump to specific positions or items within the scrollable area with smooth animations.',
    },
  },
};
export const ScrollToSide: Story = {
  name: 'ScrollToSide',
  render: ScrollAreaScrollToSide,
  parameters: {
    guide: {
      description:
        'Programmatically navigate through content by scrolling to different sides and directions.',
    },
  },
};
export const StickToBottom: Story = {
  name: 'StickToBottom',
  render: ScrollAreaStickToBottom,
  parameters: {
    guide: {
      description:
        'Implement chat-like behavior where new content automatically scrolls to the bottom, but allows manual scrolling. This Solid example uses native scroll events for pinning.',
    },
  },
};
export const Virtualization: Story = {
  render: ScrollAreaVirtualization,
  parameters: {
    guide: {
      description:
        "Handle large datasets efficiently by rendering only visible items with TanStack Virtual. Install `@tanstack/virtual-core` and copy the example's small Solid 2 binding, since TanStack's Solid adapter targets Solid 1.",
    },
  },
};
export const WithMenu: Story = {
  name: 'WithMenu',
  render: ScrollAreaWithMenu,
  parameters: {
    guide: {
      description:
        'Combine scroll area with other components like menus to handle overflowing content. This example shows how to create a scrollable menu with many items.',
    },
  },
};
export const RTL: Story = {
  name: 'RTL',
  render: ScrollAreaWithRtl,
  parameters: {
    guide: {
      description:
        'The scroll area component fully supports Right-to-Left (RTL) languages like Arabic and Hebrew.',
    },
  },
};
export const ScrollShadow: Story = {
  name: 'ScrollShadow',
  render: ScrollAreaWithScrollShadow,
  parameters: {
    guide: {
      description:
        "Add visual feedback when content is scrollable by implementing scroll shadows that appear at the edges using `mask-image`. Use the `data-overflow-y` attribute to only show shadows when content actually overflows—this prevents shadows from appearing when there's a single item or no scrollable content.",
    },
  },
};
export const Sizes: Story = {
  render: ScrollAreaWithSizes,
  parameters: {
    guide: {
      description:
        'Use the `size` prop to change the size of the scroll area. This affects the scrollbar thickness and content padding.',
    },
  },
};
export const Store: Story = {
  render: ScrollAreaWithStore,
  parameters: {
    guide: {
      description: 'Use the scroll area with external state management and programmatic control.',
    },
  },
};
export const ThumbStyling: Story = {
  name: 'ThumbStyling',
  render: ScrollAreaWithThumbStyling,
  parameters: {
    guide: {
      description:
        'Customize the appearance of the scrollbar thumb with different styles and colors.',
    },
  },
};
export const Variants: Story = {
  render: ScrollAreaWithVariants,
  parameters: {
    guide: {
      description:
        'Use the `variant` prop to change the scrollbar visibility behavior. Values can be either `hover` (default) or `always`.',
    },
  },
};
