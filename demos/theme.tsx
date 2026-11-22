import type { Demo, DemoMeta } from './demo-types';
import { ThemeBasic, ThemeNested } from './examples/theme-display';
import { withComponentInset } from './examples/example-frame';
import { ThemeWithPortalled } from './examples/theme-portalled';

export const meta = {
  component: ThemeBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: ThemeBasic };
export const Nested: Story = {
  render: ThemeNested,
  parameters: {
    guide: {
      descriptionFormat: 'markdown',
      description:
        'The theme can be nested to apply different appearances to different parts of the tree. This is useful for applying a global appearance and then overriding some parts of it.\n\n> Good to know: We use native CSS selectors to achieve this.',
    },
  },
};
export const Portalled: Story = {
  render: ThemeWithPortalled,
  parameters: {
    guide: {
      description:
        'Use the `asChild` prop to force the appearance of portalled elements like the popover and modal content.',
    },
  },
};
