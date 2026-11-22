import type { Demo, DemoMeta } from './demo-types';
import { LinkBasic, LinkVariants, LinkWithExternal, LinkWithinText } from './examples/link-display';
import { LinkVariantTable } from './examples/link-table';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: LinkBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: LinkBasic };
export const Variants: Story = {
  render: LinkVariants,
  parameters: {
    guide: {
      description: 'Use the `variant` prop to change the appearance of the `Link` component',
    },
  },
};
export const WithinText: Story = {
  name: 'WithinText',
  render: LinkWithinText,
  parameters: { guide: { description: 'Use `Link` within a text to create a hyperlink' } },
};
export const External: Story = {
  render: LinkWithExternal,
  parameters: { guide: { description: 'Add an external link icon to the `Link` component' } },
};
export const VariantMatrix: Story = { render: LinkVariantTable };
