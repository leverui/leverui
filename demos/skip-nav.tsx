import type { Demo, DemoMeta } from './demo-types';
import { SkipNavBasic, SkipNavCustomId } from './examples/skip-nav-basic';
import { SkipNavWithContent } from './examples/skip-nav-content';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: SkipNavBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: SkipNavBasic };
export const BasicExample: Story = {
  render: SkipNavBasic,
  parameters: {
    guide: {
      descriptionFormat: 'markdown',
      description:
        'The `SkipNavLink` component ideally needs to be one of the first items a user encounters when they begin navigating a page after load. Therefore, it is recommended to place it as high as possible in the app.\n\nIt renders an `a` tag and automatically creates a link with an `href` attribute that will point to `SkipNavContent`.\n\nThe `SkipNavContent` component is used as a target for the link to place keyboard focus on the first piece of main content. It renders a `div` and can either be a self-closing component, or wrap the main content.',
    },
  },
};
export const WithContent: Story = {
  render: SkipNavWithContent,
  parameters: {
    guide: {
      description:
        'The `SkipNavContent` component can wrap your main content area to ensure proper focus management.',
    },
  },
};
export const CustomId: Story = {
  render: SkipNavCustomId,
  parameters: {
    guide: {
      description:
        'You can supply a custom id value using the `id` prop but you will have to use this prop and value in both components, or they will not match.',
    },
  },
};
