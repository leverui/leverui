import { render, screen } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Loader, LoaderOverlay, type LoaderOverlayProps, type LoaderProps } from '../index';

type GetLoaderChildProps = Parameters<NonNullable<LoaderProps['asChild']>>[0];
type GetOverlayChildProps = Parameters<NonNullable<LoaderOverlayProps['asChild']>>[0];

/** Forward Loader's own content into a consumer-selected anchor. */
function renderLoaderLink(getProps: GetLoaderChildProps): JSX.Element {
  return <a {...getProps()} href="/status" data-testid="loader-link" />;
}

/** Forward overlay content into a consumer-selected section. */
function renderOverlaySection(getProps: GetOverlayChildProps): JSX.Element {
  return <section {...getProps()} data-testid="overlay-section" />;
}

/** Ensure both styled child paths retain the components' supplied children. */
function verifiesForwardedContent(): void {
  render(
    /** Mount a loading link and a section with only inherited children. */
    () => (
      <>
        <Loader asChild={renderLoaderLink} text="Loading" data-parent="loader">
          Ready
        </Loader>
        <LoaderOverlay asChild={renderOverlaySection} data-parent="overlay">
          Overlay content
        </LoaderOverlay>
      </>
    ),
  );

  const link = screen.getByTestId('loader-link');
  const overlay = screen.getByTestId('overlay-section');
  expect(link.tagName).toBe('A');
  expect(link.getAttribute('href')).toBe('/status');
  expect(link.getAttribute('data-parent')).toBe('loader');
  expect(link.className).toContain('leverui-loader');
  expect(link.textContent).toBe('Loading');
  expect(link.querySelector('.leverui-spinner')).not.toBeNull();
  expect(overlay.tagName).toBe('SECTION');
  expect(overlay.getAttribute('data-parent')).toBe('overlay');
  expect(overlay.className).toContain('leverui-loader-overlay');
  expect(overlay.textContent).toBe('Overlay content');
}

it('preserves Loader and LoaderOverlay content through asChild', verifiesForwardedContent);

/** Let a child renderer deliberately replace Loader's supplied content. */
function renderOverridingLink(getProps: GetLoaderChildProps): JSX.Element {
  return (
    <a {...getProps()} href="/status" data-testid="override-link">
      Status
    </a>
  );
}

/** Keep the child's explicit content override separate from pass-through use. */
function verifiesChildOverride(): void {
  render(
    /** Mount the explicit child-content override. */
    () => (
      <>
        <Loader asChild={renderOverridingLink} text="Loading" />
      </>
    ),
  );
  expect(screen.getByTestId('override-link').textContent).toBe('Status');
  expect(screen.getByTestId('override-link').querySelector('.leverui-spinner')).toBeNull();
}

it('allows explicit child content to replace Loader content', verifiesChildOverride);
