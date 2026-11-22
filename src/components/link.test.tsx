import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import { Link, LinkBox, LinkOverlay, LinkPropsProvider, type LinkProps } from '../index';

type GetChildProps = Parameters<NonNullable<LinkProps['asChild']>>[0];

/** Verify native anchor behavior and filtering of the recipe variant. */
function verifiesNativeLink(): void {
  let received: HTMLAnchorElement | undefined;

  /** Record the anchor forwarded through its native ref. */
  function capture(element: HTMLAnchorElement): void {
    received = element;
  }

  render(
    /** Mount the native Link without a styling provider. */
    () => (
      <Link href="#destination" variant="underline" ref={capture} data-testid="link">
        Destination
      </Link>
    ),
  );
  const link = screen.getByTestId('link');
  expect(link).toBe(received);
  expect(link.tagName).toBe('A');
  expect(link.getAttribute('href')).toBe('#destination');
  expect(link.getAttribute('variant')).toBeNull();
  expect(link.className).toContain('leverui-link');
  expect(link.getAttribute('role')).toBeNull();
}

/** Verify live provider defaults, local precedence, and stable DOM nodes. */
function verifiesLinkDefaults(): void {
  const [underlined, setUnderlined] = createSignal(false);

  /** Keep both links mounted while their shared defaults change. */
  function Example(): JSX.Element {
    return (
      <LinkPropsProvider value={{ variant: underlined() ? 'underline' : 'plain', title: 'Shared' }}>
        <Link href="#one" data-testid="inherited">
          One
        </Link>
        <Link href="#two" variant="underline" title="Local" data-testid="local">
          Two
        </Link>
      </LinkPropsProvider>
    );
  }

  render(
    /** Mount the provider once so its update cannot hide node replacement. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited');
  const local = screen.getByTestId('local');
  const initialClass = inherited.className;
  const localClass = local.className;
  expect(inherited.getAttribute('title')).toBe('Shared');
  expect(inherited.getAttribute('data-variant')).toBe('plain');
  expect(local.getAttribute('title')).toBe('Local');
  setUnderlined(true);
  flush();
  expect(screen.getByTestId('inherited')).toBe(inherited);
  expect(inherited.className).toBe(initialClass);
  expect(inherited.getAttribute('data-variant')).toBe('underline');
  expect(local.className).toBe(localClass);
}

/** Verify a routing-style child keeps the link's attributes and semantics. */
function verifiesChildLink(): void {
  let received: Element | undefined;

  /** Record the consumer-owned anchor selected by the child renderer. */
  function capture(element: Element): void {
    received = element;
  }

  /** Render a router-owned anchor from the merged link props. */
  function renderRouterLink(getProps: GetChildProps): JSX.Element {
    return (
      <a {...getProps()} data-testid="routed">
        About
      </a>
    );
  }

  render(
    /** Mount the Solid child-rendering path through the public API. */
    () => <Link asChild={renderRouterLink} ref={capture} href="/about" aria-current="page" />,
  );
  const routed = screen.getByTestId('routed');
  expect(routed).toBe(received);
  expect(routed.getAttribute('href')).toBe('/about');
  expect(routed.getAttribute('aria-current')).toBe('page');
  expect(routed.className).toContain('leverui-link');
}

/** Verify the box and stretched overlay remain native, separate elements. */
function verifiesLinkBox(): void {
  render(
    /** Mount a card with both a stretched and a separate inner link. */
    () => (
      <LinkBox as="article" data-testid="box">
        <LinkOverlay href="#article" data-testid="overlay">
          Article
        </LinkOverlay>
        <a href="#author" data-testid="inner">
          Author
        </a>
      </LinkBox>
    ),
  );
  expect(screen.getByTestId('box').tagName).toBe('ARTICLE');
  expect(screen.getByTestId('box').className).toContain('leverui-linkbox');
  expect(screen.getByTestId('overlay').tagName).toBe('A');
  expect(screen.getByTestId('overlay').getAttribute('href')).toBe('#article');
  expect(screen.getByTestId('overlay').className).toContain('leverui-linkbox__overlay');
  expect(screen.getByTestId('inner').getAttribute('href')).toBe('#author');
}

test('Link preserves native anchor semantics and filters recipe props', verifiesNativeLink);
test('Link follows provider defaults with instance precedence', verifiesLinkDefaults);
test('Link composes a consumer-owned router anchor', verifiesChildLink);
test('LinkBox and LinkOverlay preserve separate native links', verifiesLinkBox);

/** Create a separate inherited anchor label for each Link instance. */
function renderSharedLabel(): JSX.Element {
  return <span>Shared destination</span>;
}

/** Verify inherited labels do not move one Solid node between anchors. */
function verifiesSharedLabels(): void {
  render(
    /** Mount two inherited links beside a local label override. */
    () => (
      <LinkPropsProvider value={{ children: renderSharedLabel }}>
        <Link href="#first" data-testid="first" />
        <Link href="#second" data-testid="second" />
        <Link href="#local" data-testid="local-label">
          Local destination
        </Link>
      </LinkPropsProvider>
    ),
  );
  const first = screen.getByTestId('first');
  const second = screen.getByTestId('second');
  expect(first.textContent).toBe('Shared destination');
  expect(second.textContent).toBe('Shared destination');
  expect(first.querySelector('span')).not.toBe(second.querySelector('span'));
  expect(screen.getByTestId('local-label').textContent).toBe('Local destination');
}

test('Link provider creates separate shared labels', verifiesSharedLabels);
