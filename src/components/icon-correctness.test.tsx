import { render, screen } from '@solidjs/testing-library';
import { expect, it } from 'vitest';
import { Icon, IconPropsProvider, createIcon } from '../index';

/** Verify a provider-selected native tag can be overridden per Icon. */
function verifiesProviderAs(): void {
  render(
    /** Mount two Icon roots with one shared native tag default. */
    () => (
      <>
        <IconPropsProvider value={{ as: 'span', title: 'Shared tag' }}>
          <Icon data-testid="inherited-icon-tag" />
          <Icon as="svg" data-testid="local-icon-tag" />
        </IconPropsProvider>
      </>
    ),
  );

  const inherited = screen.getByTestId('inherited-icon-tag');
  const local = screen.getByTestId('local-icon-tag');
  expect(inherited.tagName).toBe('SPAN');
  expect(local.tagName.toLowerCase()).toBe('svg');
  expect(inherited.getAttribute('title')).toBe('Shared tag');
  expect(local.getAttribute('title')).toBe('Shared tag');
  expect(inherited.hasAttribute('as')).toBe(false);
  expect(local.hasAttribute('as')).toBe(false);
}

it('inherits and overrides a provider-selected native Icon tag', verifiesProviderAs);

/** Represent a conditional custom path with no rendered content. */
function renderEmptyPath(): null {
  return null;
}

const FallbackIcon = createIcon({ path: renderEmptyPath, d: 'M1 1h2v2H1z' });

/** Preserve the single-path option when custom SVG content is empty. */
function verifiesPathFallback(): void {
  render(
    /** Render the reusable Icon from the public factory. */
    () => (
      <>
        <FallbackIcon data-testid="fallback-icon" />
      </>
    ),
  );

  const path = screen.getByTestId('fallback-icon').querySelector('path');
  expect(path?.getAttribute('d')).toBe('M1 1h2v2H1z');
  expect(path?.getAttribute('fill')).toBe('currentColor');
}

it('falls back to d when a created Icon path renders nothing', verifiesPathFallback);
