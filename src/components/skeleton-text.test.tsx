import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { SkeletonPropsProvider, SkeletonText } from '../index';

afterEach(cleanup);

/** Keep Text's wrapper and line count independent of inner Skeleton defaults. */
function verifiesTextProviderBoundary(): void {
  const [providerLoading, setProviderLoading] = createSignal(false);
  const [providerVariant, setProviderVariant] = createSignal<'pulse' | 'shine'>('pulse');

  /** Supply live defaults that only the inner Skeleton instances should read. */
  function readDefaults() {
    return { loading: providerLoading(), variant: providerVariant() };
  }

  render(
    /** Mount a plain wrapper beside a provider-wrapped text placeholder. */
    () => (
      <>
        <SkeletonText noOfLines={2} rootProps={{ title: 'plain-text' }} />
        <SkeletonPropsProvider value={readDefaults}>
          <SkeletonText noOfLines={2} rootProps={{ title: 'provider-text' }} />
        </SkeletonPropsProvider>
      </>
    ),
  );

  const plain = screen.getByTitle('plain-text');
  const provider = screen.getByTitle('provider-text');
  const lines = provider.querySelectorAll('.lui-skeleton');
  expect(lines).toHaveLength(2);
  expect(provider.className).toBe(plain.className);
  const firstLine = lines[0];
  const firstVariant = firstLine?.getAttribute('data-variant');
  setProviderLoading(true);
  flush();
  expect(provider.querySelectorAll('.lui-skeleton')).toHaveLength(2);
  expect(provider.className).toBe(plain.className);
  expect(firstLine?.getAttribute('data-variant')).toBe(firstVariant);
  setProviderVariant('shine');
  flush();
  expect(firstLine?.getAttribute('data-variant')).not.toBe(firstVariant);
}

it('applies provider defaults only inside SkeletonText lines', verifiesTextProviderBoundary);

/** Give repeated custom content a separate Solid owner on every line. */
function verifiesRenderedTextChildren(): void {
  const [loading, setLoading] = createSignal(true);
  let renderCount = 0;

  /** Create one native child for the current text line. */
  function renderTextLine(): JSX.Element {
    renderCount += 1;
    return <span data-testid="rendered-text-child">Finished text</span>;
  }

  render(
    /** Mount repeatable content under reactive text placeholders. */
    () => (
      <>
        <SkeletonText loading={loading()} noOfLines={3} rootProps={{ title: 'rendered-text' }}>
          {renderTextLine}
        </SkeletonText>
      </>
    ),
  );

  const root = screen.getByTitle('rendered-text');
  const first = root.querySelector('[data-testid="rendered-text-child"]');
  expect(root.querySelectorAll('[data-testid="rendered-text-child"]')).toHaveLength(3);
  expect(renderCount).toBe(3);
  setLoading(false);
  flush();
  expect(root.querySelectorAll('[data-testid="rendered-text-child"]')).toHaveLength(1);
  expect(root.querySelector('[data-testid="rendered-text-child"]')).toBe(first);
  expect(renderCount).toBe(3);
}

it('creates and retains one child tree per SkeletonText line', verifiesRenderedTextChildren);
