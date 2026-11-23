import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { EmptyState } from '../index';

/** Verify each nested root owns its size without inserting presentation rules. */
function verifiesNativeCssScopes(): void {
  const [large, setLarge] = createSignal(false);

  /** Render nested native roots without a style provider. */
  function Example(): JSX.Element {
    return (
      <EmptyState.Root data-testid="outer" size={large() ? 'lg' : 'sm'}>
        <EmptyState.Content data-testid="outer-content">
          <EmptyState.Title>Outer</EmptyState.Title>
          <EmptyState.Root data-testid="inner" size="md">
            <EmptyState.Content>
              <EmptyState.Title>Inner</EmptyState.Title>
            </EmptyState.Content>
          </EmptyState.Root>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  render(Example);
  const outer = screen.getByTestId('outer');
  const inner = screen.getByTestId('inner');
  expect(outer.getAttribute('data-size')).toBe('sm');
  expect(inner.getAttribute('data-size')).toBe('md');
  expect(screen.getByTestId('outer-content').classList.contains('lui-empty-state__content')).toBe(
    true,
  );

  setLarge(true);
  flush();
  expect(screen.getByTestId('outer')).toBe(outer);
  expect(screen.getByTestId('inner')).toBe(inner);
  expect(outer.getAttribute('data-size')).toBe('lg');
  expect(inner.getAttribute('data-size')).toBe('md');
}

it('scopes nested native Empty State roots without a provider', verifiesNativeCssScopes);

/** Keep unsupported responsive size values out of the public CSS contract. */
function verifiesUnsupportedSize(): void {
  /** Render an invalid runtime size from an untyped consumer boundary. */
  function InvalidRoot(): JSX.Element {
    return <EmptyState.Root size={'huge' as 'sm'} />;
  }

  /** Mount one root with an invalid runtime size from an untyped boundary. */
  function renderInvalid(): void {
    render(InvalidRoot);
  }

  expect(renderInvalid).toThrow('Empty State size is unsupported: huge.');
}

it('rejects unsupported Empty State sizes', verifiesUnsupportedSize);
