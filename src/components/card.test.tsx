import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Card } from '../index';

/** Verify every Card part renders its reference element and native props. */
function verifiesCardParts(): void {
  let root: HTMLDivElement | undefined;

  /** Capture the styled Card root through its native ref. */
  function captureRoot(element: HTMLDivElement): void {
    root = element;
  }

  render(
    /** Mount the Card parts inside their root style context. */
    () => (
      <>
        <Card.Root ref={captureRoot} size="md" variant="outline" data-testid="card-root">
          <Card.Header data-testid="card-header">
            <Card.Title data-testid="card-title">Project</Card.Title>
            <Card.Description data-testid="card-description">A description</Card.Description>
          </Card.Header>
          <Card.Body data-testid="card-body">Details</Card.Body>
          <Card.Footer data-testid="card-footer">Actions</Card.Footer>
        </Card.Root>
      </>
    ),
  );

  const card = screen.getByTestId('card-root');
  expect(card).toBe(root);
  expect(card.tagName).toBe('DIV');
  expect(card.className).toContain('leverui-card');
  expect(card.hasAttribute('variant')).toBe(false);
  expect(card.hasAttribute('size')).toBe(false);
  expect(screen.getByTestId('card-header').tagName).toBe('DIV');
  expect(screen.getByTestId('card-body').tagName).toBe('DIV');
  expect(screen.getByTestId('card-footer').tagName).toBe('DIV');
  expect(screen.getByTestId('card-title').tagName).toBe('H3');
  expect(screen.getByTestId('card-description').tagName).toBe('P');
}

it('renders Card parts and native root attributes', verifiesCardParts);

/** Verify inherited size changes without replacing a Card root. */
function verifiesReactiveCardDefaults(): void {
  const [large, setLarge] = createSignal(false);

  /** Render inherited and explicitly sized cards from one provider. */
  function Example(): JSX.Element {
    return (
      <>
        <Card.PropsProvider value={{ size: large() ? 'lg' : 'sm', variant: 'outline' }}>
          <Card.Root data-testid="inherited-card">
            <Card.Body>Inherited</Card.Body>
          </Card.Root>
          <Card.Root size="md" data-testid="fixed-card">
            <Card.Body>Fixed</Card.Body>
          </Card.Root>
        </Card.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the changing provider once. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited-card');
  const fixed = screen.getByTestId('fixed-card');
  expect(inherited).toHaveAttribute('data-size', 'sm');
  expect(fixed).toHaveAttribute('data-size', 'md');
  setLarge(true);
  flush();
  expect(screen.getByTestId('inherited-card')).toBe(inherited);
  expect(inherited).toHaveAttribute('data-size', 'lg');
  expect(fixed).toHaveAttribute('data-size', 'md');
}

it('updates inherited Card size on the mounted root', verifiesReactiveCardDefaults);

/** Verify consumer classes and native attributes need no styling provider. */
function verifiesConsumerCardClass(): void {
  render(
    /** Render the Card with its authored variant selector and consumer class. */
    () => (
      <Card.Root
        class="consumer-card"
        variant="subtle"
        title="Custom card"
        data-testid="custom-card"
      >
        <Card.Body class="consumer-card-body">Custom</Card.Body>
      </Card.Root>
    ),
  );

  const card = screen.getByTestId('custom-card');
  expect(card.getAttribute('title')).toBe('Custom card');
  expect(card.hasAttribute('variant')).toBe(false);
  expect(card).toHaveAttribute('data-variant', 'subtle');
  expect(card).toHaveClass('consumer-card');
  expect(screen.getByText('Custom')).toHaveClass('consumer-card-body');
  expect(card).not.toHaveAttribute('data-leverui-private-style-runtime');
}

it('preserves native attributes with consumer Card classes', verifiesConsumerCardClass);

/** Verify responsive choices stay on one native Card as Solid signals change. */
function verifiesResponsiveCardChoices(): void {
  const [alternate, setAlternate] = createSignal(false);

  /** Read finite breakpoint choices without a styling provider. */
  function Example(): JSX.Element {
    return (
      <Card.Root
        data-testid="responsive-card"
        size={alternate() ? { base: 'lg', md: 'sm' } : { base: 'sm', md: 'lg' }}
        variant={
          alternate() ? { base: 'elevated', md: 'outline' } : { base: 'outline', md: 'subtle' }
        }
      >
        <Card.Title>Responsive Card</Card.Title>
      </Card.Root>
    );
  }

  render(
    /** Mount one Card and preserve its native element through the update. */
    () => <Example />,
  );
  const card = screen.getByTestId('responsive-card');
  expect(card).toHaveAttribute('data-size', 'sm');
  expect(card).toHaveAttribute('data-size-md', 'lg');
  expect(card).toHaveAttribute('data-variant', 'outline');
  expect(card).toHaveAttribute('data-variant-md', 'subtle');
  expect(card).not.toHaveAttribute('data-leverui-private-style-runtime');

  setAlternate(true);
  flush();
  expect(screen.getByTestId('responsive-card')).toBe(card);
  expect(card).toHaveAttribute('data-size', 'lg');
  expect(card).toHaveAttribute('data-size-md', 'sm');
  expect(card).toHaveAttribute('data-variant', 'elevated');
  expect(card).toHaveAttribute('data-variant-md', 'outline');
}

it('updates responsive Card choices on the authored CSS path', verifiesResponsiveCardChoices);
