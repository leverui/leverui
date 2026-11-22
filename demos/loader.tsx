import type { Demo, DemoMeta } from './demo-types';
import { LoaderBasic, LoaderWithBadge, LoaderWithOverlay } from './examples/loader-standard';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: LoaderBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: LoaderBasic };
export const WithBadge: Story = { render: LoaderWithBadge };
export const WithOverlay: Story = { render: LoaderWithOverlay };
