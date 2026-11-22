import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import {
  Skeleton,
  SkeletonCircle,
  SkeletonPropsProvider,
  SkeletonText,
  type SkeletonProps,
} from '../index';

type GetChildProps = Parameters<NonNullable<SkeletonProps<'div'>['asChild']>>[0];

afterEach(cleanup);

/** Render a caller-owned native element with Skeleton's styled props. */
function renderOwnedSkeleton(getProps: GetChildProps): JSX.Element {
  return <div {...getProps()} data-testid="owned-skeleton" />;
}

/** Keep the same placeholder while loading and provider defaults change. */
function verifiesSkeletonState(): void {
  const [loading, setLoading] = createSignal(true);
  const [variant, setVariant] = createSignal<'pulse' | 'shine'>('pulse');
  let received: HTMLDivElement | undefined;

  /** Capture the native placeholder ref. */
  function capture(element: HTMLDivElement): void {
    received = element;
  }

  /** Read live recipe defaults for both descendants. */
  function readDefaults(): { variant: 'pulse' | 'shine' } {
    return { variant: variant() };
  }

  render(
    /** Mount direct, inherited, and caller-owned placeholders. */
    () => (
      <>
        <SkeletonPropsProvider value={readDefaults}>
          <Skeleton data-testid="skeleton" loading={loading()} ref={capture}>
            Loaded content
          </Skeleton>
          <Skeleton data-testid="inherited-skeleton" />
          <Skeleton asChild={renderOwnedSkeleton} loading={false} />
        </SkeletonPropsProvider>
      </>
    ),
  );

  const skeleton = screen.getByTestId('skeleton');
  const inherited = screen.getByTestId('inherited-skeleton');
  expect(skeleton).toBe(received);
  expect(skeleton.textContent).toBe('Loaded content');
  expect(skeleton.className).toContain('leverui-skeleton');
  expect(screen.getByTestId('owned-skeleton').className).toContain('leverui-skeleton');
  expect(skeleton.hasAttribute('loading')).toBe(false);
  const beforeLoading = skeleton.getAttribute('data-loading');
  setLoading(false);
  flush();
  expect(screen.getByTestId('skeleton')).toBe(skeleton);
  expect(skeleton.getAttribute('data-loading')).not.toBe(beforeLoading);
  const beforeVariant = inherited.getAttribute('data-variant');
  setVariant('shine');
  flush();
  expect(inherited.getAttribute('data-variant')).not.toBe(beforeVariant);
}

it('keeps native and composed placeholders reactive', verifiesSkeletonState);

/** Keep Circle geometry on the placeholder's selected native element. */
function verifiesSkeletonCircle(): void {
  let received: HTMLDivElement | undefined;

  /** Capture the circular placeholder ref. */
  function capture(element: HTMLDivElement): void {
    received = element;
  }

  render(
    /** Mount one sized circle inside its component root. */
    () => (
      <>
        <SkeletonCircle size="10" data-testid="circle" ref={capture} />
      </>
    ),
  );

  const circle = screen.getByTestId('circle');
  expect(circle).toBe(received);
  expect(circle.tagName).toBe('DIV');
  expect(circle.className).toContain('leverui-skeleton');
  expect(circle.className).toContain('leverui-circle');
}

it('composes circle and skeleton on one native element', verifiesSkeletonCircle);

/** Change line count and reveal one retained line of loaded content. */
function verifiesSkeletonText(): void {
  const [loading, setLoading] = createSignal(true);
  const [lineCount, setLineCount] = createSignal(3);
  let received: HTMLDivElement | undefined;

  /** Capture the text wrapper rather than an inner line. */
  function capture(element: HTMLDivElement): void {
    received = element;
  }

  render(
    /** Mount a reactive text group with native wrapper options. */
    () => (
      <>
        <SkeletonText
          loading={loading()}
          noOfLines={lineCount()}
          rootProps={{ title: 'text-root' }}
          ref={capture}
        >
          <span data-testid="text-content">Finished text</span>
        </SkeletonText>
      </>
    ),
  );

  const root = screen.getByTitle('text-root');
  expect(root).toBe(received);
  expect(root.querySelectorAll('.leverui-skeleton')).toHaveLength(3);
  expect(root.querySelectorAll('[data-testid="text-content"]')).toHaveLength(3);
  const firstContent = root.querySelector('[data-testid="text-content"]');
  setLineCount(5);
  flush();
  expect(root.querySelectorAll('.leverui-skeleton')).toHaveLength(5);
  expect(root.querySelectorAll('[data-testid="text-content"]')).toHaveLength(5);
  const first = root.querySelector('.leverui-skeleton');
  setLoading(false);
  flush();
  expect(root.querySelectorAll('.leverui-skeleton')).toHaveLength(1);
  expect(root.querySelectorAll('[data-testid="text-content"]')).toHaveLength(1);
  expect(root.querySelector('.leverui-skeleton')).toBe(first);
  expect(root.querySelector('[data-testid="text-content"]')).toBe(firstContent);
  expect(root.textContent).toBe('Finished text');
}

it('renders reactive text lines and one loaded child', verifiesSkeletonText);

/** Render a caller-owned text wrapper with the generated lines. */
function renderOwnedTextRoot(getProps: GetChildProps): JSX.Element {
  return <section {...getProps()} data-testid="owned-text-root" />;
}

/** Preserve composition and selected-element classes for both helpers. */
function verifiesSkeletonHelperComposition(): void {
  render(
    /** Mount caller-owned circle and text roots. */
    () => (
      <>
        <SkeletonCircle size="10" asChild={renderOwnedSkeleton} />
        <SkeletonText noOfLines={2} rootProps={{ asChild: renderOwnedTextRoot }} />
      </>
    ),
  );

  const circle = screen.getByTestId('owned-skeleton');
  const text = screen.getByTestId('owned-text-root');
  expect(circle.className).toContain('leverui-circle');
  expect(circle.className).toContain('leverui-skeleton');
  expect(text.tagName).toBe('SECTION');
  expect(text.querySelectorAll('.leverui-skeleton')).toHaveLength(2);
}

it('composes caller-owned circle and text roots', verifiesSkeletonHelperComposition);
