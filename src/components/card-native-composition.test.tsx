import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import type { RenderChild } from '../styled-system/child-props';
import * as Card from './card';

type GetChildProps = Parameters<RenderChild>[0];

/** Render a caller-owned root with Card attributes and its own class. */
function renderOwnedRoot(getProps: GetChildProps): JSX.Element {
  return <article {...getProps({ class: 'owned-card' })} data-testid="owned-card" />;
}

/** Render a caller-owned Card heading without changing its semantics. */
function renderOwnedTitle(getProps: GetChildProps): JSX.Element {
  return <h2 {...getProps()} data-testid="owned-card-title" />;
}

/** Render a caller-owned Card body with native section semantics. */
function renderOwnedBody(getProps: GetChildProps): JSX.Element {
  return <section {...getProps()} data-testid="owned-card-body" />;
}

/** Keep selected Card tags and public hooks on the authored CSS path. */
function verifiesSelectedTags(): void {
  const [rootTag, setRootTag] = createSignal<'section' | 'article'>('section');
  const [titleTag, setTitleTag] = createSignal<'h2' | 'h4'>('h2');
  render(
    /** Mount Card parts under their selected root. */
    () => (
      <Card.Root as={rootTag()} data-testid="selected-card">
        <Card.Title as={titleTag()} data-testid="selected-title">
          Selected heading
        </Card.Title>
        <Card.Body as="article" data-testid="selected-body">
          Content
        </Card.Body>
      </Card.Root>
    ),
  );
  const root = screen.getByTestId('selected-card');
  expect(root.tagName).toBe('SECTION');
  expect(root.className).toContain('lui-card__root');
  expect(root).not.toHaveAttribute('data-lui-private-style-runtime');
  expect(screen.getByTestId('selected-title').tagName).toBe('H2');
  expect(screen.getByTestId('selected-title').className).toContain('lui-card__title');
  expect(screen.getByTestId('selected-body').tagName).toBe('ARTICLE');
  expect(screen.getByTestId('selected-body').className).toContain('lui-card__body');
  setRootTag('article');
  flush();
  expect(screen.getByTestId('selected-card').tagName).toBe('ARTICLE');
  setTitleTag('h4');
  flush();
  expect(screen.getByTestId('selected-title').tagName).toBe('H4');
}

it('renders selected Card tags with authored CSS hooks', verifiesSelectedTags);

/** Keep caller-owned Card nodes mounted as responsive choices change. */
function verifiesCallerOwnedParts(): void {
  const [large, setLarge] = createSignal(false);

  /** Render one caller-owned root and two caller-owned parts. */
  function Example(): JSX.Element {
    return (
      <Card.Root asChild={renderOwnedRoot} class="custom-card" size={large() ? 'lg' : 'sm'}>
        <Card.Title asChild={renderOwnedTitle}>Owned heading</Card.Title>
        <Card.Body asChild={renderOwnedBody}>Owned content</Card.Body>
      </Card.Root>
    );
  }

  render(
    /** Mount the owned elements once before changing their root size. */
    () => <Example />,
  );
  const root = screen.getByTestId('owned-card');
  expect(root.tagName).toBe('ARTICLE');
  expect(root.className).toContain('lui-card__root');
  expect(root.className).toContain('owned-card');
  expect(root.className).toContain('custom-card');
  expect(root).toHaveAttribute('data-size', 'sm');
  expect(root).not.toHaveAttribute('data-lui-private-style-runtime');
  expect(screen.getByTestId('owned-card-title').textContent).toBe('Owned heading');
  expect(screen.getByTestId('owned-card-body').textContent).toBe('Owned content');
  const title = screen.getByTestId('owned-card-title');
  const body = screen.getByTestId('owned-card-body');

  setLarge(true);
  flush();
  expect(screen.getByTestId('owned-card')).toBe(root);
  expect(screen.getByTestId('owned-card-title')).toBe(title);
  expect(screen.getByTestId('owned-card-body')).toBe(body);
  expect(root).toHaveAttribute('data-size', 'lg');
}

it('preserves caller-owned Card nodes through responsive updates', verifiesCallerOwnedParts);

/** Keep inherited unstyled state reactive without remounting Card parts. */
function verifiesInheritedUnstyled(): void {
  const [unstyled, setUnstyled] = createSignal(false);

  /** Render one Card whose presentation choice can change after mounting. */
  function Example(): JSX.Element {
    return (
      <Card.Root unstyled={unstyled()}>
        <Card.Body data-testid="unstyled-body">Content</Card.Body>
      </Card.Root>
    );
  }

  render(
    /** Mount the Card once before changing its presentation choice. */
    () => <Example />,
  );
  const body = screen.getByTestId('unstyled-body');
  expect(body).not.toHaveAttribute('data-unstyled');
  setUnstyled(true);
  flush();
  expect(screen.getByTestId('unstyled-body')).toBe(body);
  expect(body).toHaveAttribute('data-unstyled', '');
}

it('updates inherited Card unstyled state on mounted parts', verifiesInheritedUnstyled);
