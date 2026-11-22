import type { Demo, DemoMeta } from './demo-types';
import { LinkOverlayArticle, LinkOverlayBasic } from './examples/link-overlay-display';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: LinkOverlayBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

const customLinkNote = `### Custom Link

Use the \`asChild\` prop to add support for a custom Link component like Solid
Router's \`A\`. In Solid, \`asChild\` is a render function; spread \`getProps()\` onto
your link so it keeps the overlay's behavior and styles.

\`\`\`tsx
import { LinkBox, LinkOverlay } from '@leverui/components';
import { A } from '@solidjs/router';

function Example() {
  return (
    <LinkBox as="article">
      <h2>
        <LinkOverlay
          asChild={(getProps) => (
            <A {...getProps()} href="#">
              Blog Post Title
            </A>
          )}
        />
      </h2>
      <p>Some blog post content</p>
      <A href="#inner-link">Some inner link</A>
    </LinkBox>
  );
}
\`\`\``;

export const Basic: Story = {
  render: LinkOverlayBasic,
};
export const Article: Story = {
  render: LinkOverlayArticle,
  parameters: {
    guide: {
      description: "Here's an example of using `LinkOverlay` to link an entire article.",
      after: customLinkNote,
    },
  },
};
