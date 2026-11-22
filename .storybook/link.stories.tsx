import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { LinkBox } from '../src/components/link-box';
import { LinkOverlay, type LinkOverlayProps } from '../src/components/link-overlay';
import { LinkPropsProvider } from '../src/components/link-props';
import { Link, type LinkProps } from '../src/components/link';
import { Theme } from '../src/components/theme';
import './link-contract.css';

type GetChildProps = Parameters<NonNullable<LinkProps['asChild']>>[0];
type GetOverlayProps = Parameters<NonNullable<LinkOverlayProps['asChild']>>[0];

/** Render a consumer-owned anchor to exercise routing composition. */
function renderRouterAnchor(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} data-testid="link-router">
      Route
    </a>
  );
}

/** Compose the stretched overlay with a styled Link anchor. */
function renderOverlayLink(getProps: GetOverlayProps): JSX.Element {
  return (
    <Link
      {...getProps()}
      href="#composed-article"
      variant="underline"
      data-testid="link-composed-overlay"
    >
      Composed article
    </Link>
  );
}

/** Display Link variants, composition, and live provider defaults. */
function LinkContract(): JSX.Element {
  const [underlined, setUnderlined] = createSignal(false);

  /** Change the inherited variant without replacing the anchor. */
  function toggleVariant(): void {
    setUnderlined(!underlined());
  }

  return (
    <div style={{ padding: '24px', display: 'grid', gap: '20px' }}>
      <div>
        <Link href="#plain" data-testid="link-plain">
          Plain link
        </Link>
      </div>
      <Link href="#underlined" variant="underline" data-testid="link-underline">
        Underlined link
      </Link>
      <p>
        Read the{' '}
        <Link href="#inline" data-testid="link-inline">
          inline link
        </Link>{' '}
        here.
      </p>
      <Link href="#external" target="_blank" rel="noopener noreferrer" data-testid="link-external">
        External destination <span aria-hidden="true">↗</span>
      </Link>
      <Link
        href="#current"
        aria-current="page"
        class="link-contract-current"
        data-testid="link-current"
      >
        Current page
      </Link>
      <Link
        href="#responsive"
        variant={{ base: 'plain', md: 'underline' }}
        data-testid="link-responsive"
      >
        Responsive link
      </Link>
      <Link
        href="#responsive-plain"
        variant={{ base: 'underline', md: 'plain' }}
        data-testid="link-responsive-plain"
      >
        Responsive plain link
      </Link>
      <LinkPropsProvider
        value={{ variant: underlined() ? 'underline' : 'plain', title: 'Shared link' }}
      >
        <Link href="#inherited" data-testid="link-inherited">
          Inherited
        </Link>
        <Link href="#fixed" variant="underline" title="Local link" data-testid="link-fixed">
          Fixed
        </Link>
      </LinkPropsProvider>
      <Link asChild={renderRouterAnchor} href="#route" />
      <div>
        <Link unstyled href="#unstyled" data-testid="link-unstyled">
          Unstyled
        </Link>
      </div>
      <Link class="link-contract-color" href="#css" data-testid="link-css">
        Local CSS
      </Link>
      <Link href="#blue" colorPalette="blue" variant="underline" data-testid="link-blue">
        Blue palette
      </Link>
      <Link href="#green" colorPalette="green" variant="underline" data-testid="link-green">
        Green palette
      </Link>
      <Link href="#light" colorPalette="blue" variant="underline" data-testid="link-light">
        Light scope
      </Link>
      <Theme appearance="dark" hasBackground={false}>
        <Link href="#dark" colorPalette="blue" variant="underline" data-testid="link-dark">
          Dark scope
        </Link>
        <Theme appearance="light" hasBackground={false}>
          <Link
            href="#nested-light"
            colorPalette="blue"
            variant="underline"
            data-testid="link-nested-light"
          >
            Nested light scope
          </Link>
        </Theme>
      </Theme>
      <LinkBox as="article" class="link-contract-card" data-testid="link-box">
        <h2>
          <LinkOverlay href="#article" data-testid="link-overlay">
            Article title
          </LinkOverlay>
        </h2>
        <p>Click the card background to open the article.</p>
        <a href="#author" data-testid="link-inner">
          Author
        </a>
        <abbr title="Accessibility">A11y</abbr>
      </LinkBox>
      <LinkBox as="article" class="link-contract-card" data-testid="link-composed-box">
        <h2>
          <LinkOverlay asChild={renderOverlayLink} />
        </h2>
        <p>The composed article card remains one link.</p>
        <a href="#composed-inner" data-testid="link-composed-inner">
          Separate inner link
        </a>
      </LinkBox>
      <LinkBox unstyled data-testid="link-unstyled-box">
        <LinkOverlay unstyled href="#unstyled-card" data-testid="link-unstyled-overlay">
          Unstyled card link
        </LinkOverlay>
      </LinkBox>
      <button type="button" data-testid="link-toggle" onClick={toggleVariant}>
        Toggle variant
      </button>
    </div>
  );
}

const meta = {
  title: 'Content/Link',
  component: LinkContract,
} satisfies Meta<typeof LinkContract>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
