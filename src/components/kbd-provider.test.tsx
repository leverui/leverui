import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import { Kbd, KbdPropsProvider } from '../index';

/** Give each inherited Kbd a new Escape label node. */
function renderEscape(): JSX.Element {
  return <span data-testid="shared-key">Esc</span>;
}

/** Give each inherited Kbd a new Enter label node. */
function renderEnter(): JSX.Element {
  return <span data-testid="shared-key">Enter</span>;
}

/** Verify shared content is distinct, reactive, and below local children. */
function verifiesSharedKbdChildren(): void {
  const [large, setLarge] = createSignal(false);
  const [alternate, setAlternate] = createSignal(false);

  /** Mount inherited and locally labeled Kbd instances. */
  function Example(): JSX.Element {
    return (
      <KbdPropsProvider
        value={{
          size: large() ? 'lg' : 'sm',
          children: alternate() ? renderEnter : renderEscape,
        }}
      >
        <Kbd data-testid="first-key" />
        <Kbd data-testid="second-key" />
        <Kbd data-testid="local-key">
          <span>Local</span>
        </Kbd>
      </KbdPropsProvider>
    );
  }

  render(
    /** Mount the provider once so updates exercise existing Kbd nodes. */
    () => <Example />,
  );
  const first = screen.getByTestId('first-key');
  const second = screen.getByTestId('second-key');
  const initialClass = first.className;
  const firstChild = first.querySelector('span');
  const secondChild = second.querySelector('span');
  expect(firstChild).not.toBeNull();
  expect(secondChild).not.toBeNull();
  expect(firstChild).not.toBe(secondChild);
  expect(first.textContent).toBe('Esc');
  expect(second.textContent).toBe('Esc');
  expect(screen.getByTestId('local-key').textContent).toBe('Local');

  setLarge(true);
  flush();
  expect(first.querySelector('span')).toBe(firstChild);
  expect(second.querySelector('span')).toBe(secondChild);
  expect(first.className).toBe(initialClass);
  expect(first.getAttribute('data-size')).toBe('lg');

  setAlternate(true);
  flush();
  expect(screen.getByTestId('first-key')).toBe(first);
  expect(screen.getByTestId('second-key')).toBe(second);
  expect(first.textContent).toBe('Enter');
  expect(second.textContent).toBe('Enter');
  expect(first.querySelector('span')).not.toBe(second.querySelector('span'));
  expect(screen.getByTestId('local-key').textContent).toBe('Local');
}

test(
  'Kbd provider renders separate reactive children with local precedence',
  verifiesSharedKbdChildren,
);
