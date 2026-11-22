import type { Demo, DemoMeta } from './demo-types';
import {
  IconBasic,
  IconWithCreateIcon,
  IconWithCustomSvg,
  IconWithSolidComponent,
} from './examples/icon-standard';
import { IconWithAsProp, IconWithSizes } from './examples/icon-custom';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: IconBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: IconBasic };
export const SolidComponent: Story = {
  render: IconWithSolidComponent,
  parameters: {
    guide: {
      description: 'Integrate with popular Solid icon libraries, or your own SVG icon components.',
    },
  },
};
export const CustomSvg: Story = {
  render: IconWithCustomSvg,
  parameters: {
    guide: {
      description: 'Use the `asChild` prop to render custom svg icons within the `Icon` component',
    },
  },
};
export const CreateIcon: Story = {
  render: IconWithCreateIcon,
  parameters: {
    guide: { description: 'Use the `createIcon` utility to create custom icons' },
  },
};
export const AsProp: Story = { render: IconWithAsProp };
export const Sizes: Story = { render: IconWithSizes };
