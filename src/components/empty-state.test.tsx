import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';
import { EmptyState, EmptyStatePropsProvider } from '../index';

/** Verify the native parts, caller content, and explicit announcement role. */
function verifiesCompoundMarkup(): void {
  render(
    /** Mount every public part beneath the compatibility provider. */
    () => (
      <>
        <EmptyState.Root data-testid="empty" role="status" size="sm">
          <EmptyState.Content data-testid="content">
            <EmptyState.Indicator data-testid="indicator">
              <span aria-hidden="true">◎</span>
            </EmptyState.Indicator>
            <EmptyState.Title data-testid="title">No results</EmptyState.Title>
            <EmptyState.Description data-testid="description">
              Try another search.
            </EmptyState.Description>
            <button type="button">Clear filters</button>
          </EmptyState.Content>
        </EmptyState.Root>
      </>
    ),
  );
  const root = screen.getByTestId('empty');
  expect(root.tagName).toBe('DIV');
  expect(root.getAttribute('role')).toBe('status');
  expect(root.hasAttribute('size')).toBe(false);
  expect(screen.getByTestId('content').tagName).toBe('DIV');
  expect(screen.getByTestId('indicator').tagName).toBe('DIV');
  expect(screen.getByTestId('title').tagName).toBe('H3');
  expect(screen.getByTestId('description').tagName).toBe('P');
  expect(screen.getByRole('button', { name: 'Clear filters' })).toBeDefined();
  expect(root.className).toContain('leverui-empty-state__root');
}

it('renders native Empty State parts and caller actions', verifiesCompoundMarkup);

/** Verify provider defaults and signal changes retain the native root. */
function verifiesReactiveSize(): void {
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');

  /** Read the current size when a descendant root resolves defaults. */
  function readDefaults(): { size: 'sm' | 'lg' } {
    return { size: size() };
  }

  render(
    /** Supply variant defaults to both inherited and explicit roots. */
    () => (
      <>
        <EmptyStatePropsProvider value={readDefaults}>
          <EmptyState.Root data-testid="inherited">
            <EmptyState.Content>
              <EmptyState.Title>Inherited</EmptyState.Title>
            </EmptyState.Content>
          </EmptyState.Root>
          <EmptyState.Root data-testid="explicit" size="md">
            <EmptyState.Content>
              <EmptyState.Title>Explicit</EmptyState.Title>
            </EmptyState.Content>
          </EmptyState.Root>
        </EmptyStatePropsProvider>
      </>
    ),
  );
  const inherited = screen.getByTestId('inherited');
  const explicit = screen.getByTestId('explicit');
  expect(inherited.getAttribute('data-size')).toBe('sm');
  expect(explicit.getAttribute('data-size')).toBe('md');
  setSize('lg');
  flush();
  expect(screen.getByTestId('inherited')).toBe(inherited);
  expect(inherited.getAttribute('data-size')).toBe('lg');
  expect(explicit.getAttribute('data-size')).toBe('md');
  expect(inherited.hasAttribute('size')).toBe(false);
}

it('updates inherited size without replacing or overriding explicit roots', verifiesReactiveSize);

/** Verify a selected root and child title receive native refs. */
function verifiesSelectedElements(): void {
  let rootTag: string | undefined;
  let titleTag: string | undefined;

  /** Record the selected native root. */
  function captureRoot(element: HTMLElement): void {
    rootTag = element.tagName;
  }

  /** Record the caller-owned title child. */
  function captureTitle(element: HTMLElement): void {
    titleTag = element.tagName;
  }

  render(
    /** Exercise native selection and child composition through public types. */
    () => (
      <>
        <EmptyState.Root as="section" ref={captureRoot}>
          <EmptyState.Content>
            <EmptyState.Title
              asChild={
                /** Merge title styling into the native heading. */
                (getProps) => (
                  <h2 {...getProps()} ref={captureTitle}>
                    No items
                  </h2>
                )
              }
            />
          </EmptyState.Content>
        </EmptyState.Root>
      </>
    ),
  );
  expect(rootTag).toBe('SECTION');
  expect(titleTag).toBe('H2');
  expect(screen.getByRole('heading', { level: 2, name: 'No items' })).toBeDefined();
}

it('forwards selected native elements and child refs', verifiesSelectedElements);
