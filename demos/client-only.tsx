import type { Demo, DemoMeta } from './demo-types';
import {
  ClientOnlyBasic,
  ClientOnlyRenderProp,
  ClientOnlyWithFallback,
} from './examples/client-only-guide';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: ClientOnlyBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: ClientOnlyBasic };
export const WithFallback: Story = {
  render: ClientOnlyWithFallback,
  parameters: {
    guide: {
      description:
        'Use the `fallback` prop to render a loading state while the client-side content is being prepared.',
    },
  },
};
export const RenderProp: Story = {
  render: ClientOnlyRenderProp,
  parameters: {
    guide: {
      description:
        'When your component accesses browser-only APIs (like `window`, `document`, or `localStorage`), use the render prop pattern to prevent server-side rendering issues:',
      after:
        'This pattern ensures that components accessing browser APIs are only evaluated on the client side, preventing hydration mismatches and server-side errors.\n\n> It can also be used for rendering heavy components that are not needed on the server side.',
    },
  },
};
