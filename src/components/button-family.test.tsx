import { render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Button, ButtonGroup, ButtonPropsProvider, CloseButton, IconButton } from '../index';

/** Verify the icon action keeps native button semantics and its supplied name. */
function verifiesIconButton(): void {
  let element: HTMLButtonElement | undefined;

  /** Record the actual native button supplied to the consumer. */
  function capture(button: HTMLButtonElement): void {
    element = button;
  }

  render(
    /** Mount an icon action in one Solid owner. */
    () => (
      <>
        <IconButton aria-label="Open settings" ref={capture}>
          <span aria-hidden="true">⚙</span>
        </IconButton>
      </>
    ),
  );

  const button = screen.getByRole('button', { name: 'Open settings' });
  expect(button).toBe(element);
  expect(button.getAttribute('type')).toBe('button');
  expect(button.textContent).toBe('⚙');
}

it('keeps native icon button semantics and refs', verifiesIconButton);

/** Verify the close action's name, glyph, and consumer overrides. */
function verifiesCloseButton(): void {
  render(
    /** Mount both default and customized close actions. */
    () => (
      <>
        <CloseButton />
        <CloseButton aria-label="Dismiss notice">Dismiss</CloseButton>
      </>
    ),
  );

  const defaultClose = screen.getByRole('button', { name: 'Close' });
  expect(defaultClose.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  expect(screen.getByRole('button', { name: 'Dismiss notice' }).textContent).toBe('Dismiss');
}

it('provides an accessible default close action', verifiesCloseButton);

/** Verify group defaults and per-button overrides update without remounting. */
function verifiesButtonDefaults(): void {
  const [variant, setVariant] = createSignal<'solid' | 'outline'>('solid');

  /** Mount changing provider and group defaults around two Buttons. */
  function Example(): JSX.Element {
    return (
      <>
        <ButtonPropsProvider value={{ variant: variant() }}>
          <Button data-testid="provider-button">Provider</Button>
          <Button variant="ghost" data-testid="override-button">
            Override
          </Button>
        </ButtonPropsProvider>
        <ButtonGroup size="lg" attached data-testid="button-group">
          <Button data-testid="group-button">Grouped</Button>
          <Button size="sm">Small</Button>
        </ButtonGroup>
      </>
    );
  }

  render(
    /** Mount the live defaults example in Solid's tracked JSX scope. */
    () => <Example />,
  );
  const providerButton = screen.getByTestId('provider-button');
  const overrideButton = screen.getByTestId('override-button');
  const initialVariant = providerButton.getAttribute('data-variant');
  const overrideVariant = overrideButton.getAttribute('data-variant');
  expect(screen.getByTestId('button-group').tagName).toBe('DIV');
  expect(screen.getByTestId('group-button').getAttribute('size')).toBeNull();

  setVariant('outline');
  flush();
  expect(initialVariant).toBe('solid');
  expect(providerButton.getAttribute('data-variant')).toBe('outline');
  expect(overrideButton.getAttribute('data-variant')).toBe(overrideVariant);
}

it('inherits reactive provider and group presentation defaults', verifiesButtonDefaults);

/** Verify rendered children receive group positions around a skipped item. */
function verifiesGroupPositions(): void {
  /** Exclude the marked DOM child from joined-edge calculations. */
  function skipSeparator(child: Element): boolean {
    return child.getAttribute('data-skip') === 'yes';
  }

  render(
    /** Mount a three-child group with one omitted element. */
    () => (
      <>
        <ButtonGroup skip={skipSeparator} stacking="first-on-top">
          <Button data-testid="first-group-button">First</Button>
          <span data-skip="yes" data-testid="group-separator">
            |
          </span>
          <Button data-testid="last-group-button">Last</Button>
        </ButtonGroup>
      </>
    ),
  );

  const first = screen.getByTestId('first-group-button');
  const last = screen.getByTestId('last-group-button');
  expect(first.hasAttribute('data-lui-group-first')).toBe(true);
  expect(first.style.getPropertyValue('--lui-group-count')).toBe('2');
  expect(first.style.getPropertyValue('--lui-group-index')).toBe('0');
  expect(screen.getByTestId('group-separator').hasAttribute('data-lui-group-auto-skip')).toBe(true);
  expect(last.hasAttribute('data-lui-group-last')).toBe(true);
  expect(last.style.getPropertyValue('--lui-group-index')).toBe('1');
}

it('positions direct ButtonGroup children around skipped elements', verifiesGroupPositions);

/** Keep group positions current when a Solid child changes its skip marker. */
async function verifiesReactiveSkipMarker(): Promise<void> {
  const [skip, setSkip] = createSignal(false);

  /** Render three actions with a reactive marker on the middle action. */
  function Example(): JSX.Element {
    return (
      <>
        <ButtonGroup attached>
          <Button data-testid="first-reactive-group">First</Button>
          <Button data-testid="middle-reactive-group" data-lui-group-skip={skip() ? '' : undefined}>
            Middle
          </Button>
          <Button data-testid="last-reactive-group">Last</Button>
        </ButtonGroup>
      </>
    );
  }

  render(
    /** Mount the group in Solid's tracked JSX scope. */
    () => <Example />,
  );
  const first = screen.getByTestId('first-reactive-group');
  const last = screen.getByTestId('last-reactive-group');
  expect(first.style.getPropertyValue('--lui-group-count')).toBe('3');

  setSkip(true);
  flush();
  await waitFor(
    /** Wait for the group observer to reindex the remaining actions. */
    () => expect(first.style.getPropertyValue('--lui-group-count')).toBe('2'),
  );
  expect(last.style.getPropertyValue('--lui-group-index')).toBe('1');

  setSkip(false);
  flush();
  await waitFor(
    /** Wait for the restored action to regain its group position. */
    () => expect(first.style.getPropertyValue('--lui-group-count')).toBe('3'),
  );
  expect(last.style.getPropertyValue('--lui-group-index')).toBe('2');
}

it('reindexes ButtonGroup when a skip marker changes', verifiesReactiveSkipMarker);
