import type { Demo, DemoMeta } from './demo-types';
import { PortalBasic, PortalWithContainer, PortalWithIframe } from './examples/portal-standard';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: PortalBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: PortalBasic };
export const Iframe: Story = { render: PortalWithIframe };
export const Container: Story = { render: PortalWithContainer };
