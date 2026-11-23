import { render, screen } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import type { RenderChild } from '../styled-system/child-props';
import { Status } from './status-exports';

/** Verify native elements, children, and indicator customization. */
function verifiesStatusParts(): void {
  render(
    /** Mount both parts inside one Status root. */
    () => (
      <>
        <Status.Root data-testid="status-root" title="Current state">
          <Status.Indicator data-testid="status-indicator">
            <span>Custom dot</span>
          </Status.Indicator>
          Processing
        </Status.Root>
      </>
    ),
  );

  const root = screen.getByTestId('status-root');
  const indicator = screen.getByTestId('status-indicator');
  expect(root.tagName).toBe('DIV');
  expect(root.getAttribute('title')).toBe('Current state');
  expect(root.getAttribute('role')).toBeNull();
  expect(root.textContent).toContain('Processing');
  expect(indicator.tagName).toBe('DIV');
  expect(indicator.textContent).toBe('Custom dot');
  expect(indicator.className).toContain('lui-status__indicator');
  expect(root.getAttribute('data-size')).toBe('md');
  expect(root.hasAttribute('data-lui-private-style-runtime')).toBe(false);
}

it('renders Status as native div parts with consumer content', verifiesStatusParts);

/** Keep unstyled composition and native styles outside authored rules. */
function verifiesStatusPresentationPaths(): void {
  render(
    /** Mount unstyled and natively styled roots under the default provider. */
    () => (
      <>
        <Status.Root unstyled data-testid="unstyled-status">
          <Status.Indicator unstyled data-testid="unstyled-indicator" />
        </Status.Root>
        <Status.Root style={{ padding: '4px' }} data-testid="custom-status">
          <Status.Indicator />
        </Status.Root>
      </>
    ),
  );
  expect(screen.getByTestId('unstyled-status').hasAttribute('data-unstyled')).toBe(true);
  expect(screen.getByTestId('unstyled-indicator').hasAttribute('data-unstyled')).toBe(true);
  expect(screen.getByTestId('custom-status').getAttribute('style')).toContain('padding: 4px');
}

it('preserves unstyled and native style paths', verifiesStatusPresentationPaths);

type GetChildProps = Parameters<RenderChild>[0];

/** Render a caller-owned inline root through merged native attributes. */
function renderOwnedRoot(getProps: GetChildProps): JSX.Element {
  return <span {...getProps({ class: 'owned-status' })} data-testid="owned-status" />;
}

/** Render a caller-owned indicator through merged part attributes. */
function renderOwnedIndicator(getProps: GetChildProps): JSX.Element {
  return <span {...getProps()} data-testid="owned-indicator" />;
}

/** Preserve caller-owned nodes, refs, and classes without a style provider. */
function verifiesOwnedStatusParts(): void {
  let root: HTMLElement | undefined;

  /** Capture the selected inline root element. */
  function captureRoot(element: HTMLElement): void {
    root = element;
  }

  render(
    /** Mount both caller-owned parts within the root context. */
    () => (
      <Status.Root asChild={renderOwnedRoot} ref={captureRoot} colorPalette="green">
        <Status.Indicator asChild={renderOwnedIndicator} />
        Ready
      </Status.Root>
    ),
  );
  const owned = screen.getByTestId('owned-status');
  expect(owned).toBe(root);
  expect(owned.tagName).toBe('SPAN');
  expect(owned.className).toContain('lui-status__root');
  expect(owned.className).toContain('owned-status');
  expect(owned.getAttribute('data-lui-color-palette')).toBe('green');
  const indicator = screen.getByTestId('owned-indicator');
  expect(indicator.tagName).toBe('SPAN');
  expect(indicator.className).toContain('lui-status__indicator');
}

it('supports caller-owned Status parts without a styling provider', verifiesOwnedStatusParts);

/** Reject a size or palette that authored selectors cannot represent. */
function verifiesInvalidStatusChoices(): void {
  /** Attempt to mount a size without authored CSS. */
  function mountInvalidSize(): void {
    render(() => <Status.Root size={'xl' as 'sm'} />);
  }

  /** Attempt to mount an empty palette selector. */
  function mountInvalidPalette(): void {
    render(() => <Status.Root colorPalette=" " />);
  }

  expect(mountInvalidSize).toThrow(/Status size uses an unsupported/);
  expect(mountInvalidPalette).toThrow(/Status colorPalette must be a nonempty/);
}

it('rejects unsupported Status size and palette choices', verifiesInvalidStatusChoices);
