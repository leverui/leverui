import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import { Kbd, KbdPropsProvider, type KbdProps } from '../index';

type GetChildProps = Parameters<NonNullable<KbdProps['asChild']>>[0];

/** Verify semantic markup, native attributes, ref forwarding, and variant filtering. */
function verifiesNativeKbd(): void {
  let received: HTMLElement | undefined;

  /** Record the native element passed to the consumer. */
  function capture(element: HTMLElement): void {
    received = element;
  }

  render(
    /** Mount the public component without a styling provider. */
    () => (
      <Kbd ref={capture} size="lg" variant="raised" title="Escape key" data-testid="key">
        Esc
      </Kbd>
    ),
  );
  const key = screen.getByTestId('key');
  expect(key).toBe(received);
  expect(key.tagName).toBe('KBD');
  expect(key.textContent).toBe('Esc');
  expect(key.getAttribute('title')).toBe('Escape key');
  expect(key.className).toContain('lui-kbd');
  expect(key.hasAttribute('size')).toBe(false);
  expect(key.hasAttribute('variant')).toBe(false);
  expect(key.hasAttribute('role')).toBe(false);
}

/** Verify changing defaults update existing nodes while local props win. */
function verifiesKbdDefaults(): void {
  const [large, setLarge] = createSignal(false);

  /** Keep descendant nodes mounted while the provider value changes. */
  function Example(): JSX.Element {
    return (
      <KbdPropsProvider value={{ size: large() ? 'lg' : 'sm', variant: 'outline' }}>
        <Kbd data-testid="inherited">Esc</Kbd>
        <Kbd size="md" data-testid="fixed">
          Enter
        </Kbd>
      </KbdPropsProvider>
    );
  }

  render(
    /** Mount the reactive example once. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited');
  const fixed = screen.getByTestId('fixed');
  const initialClass = inherited.className;
  const fixedClass = fixed.className;
  expect(inherited.getAttribute('data-size')).toBe('sm');
  setLarge(true);
  flush();
  expect(screen.getByTestId('inherited')).toBe(inherited);
  expect(inherited.className).toBe(initialClass);
  expect(inherited.getAttribute('data-size')).toBe('lg');
  expect(fixed.className).toBe(fixedClass);
}

/** Verify selected native elements and child renderers keep Kbd attributes. */
function verifiesKbdComposition(): void {
  let selected: HTMLSpanElement | undefined;

  /** Record the selected span through its typed ref. */
  function capture(element: HTMLSpanElement): void {
    selected = element;
  }

  /** Apply Kbd props to a consumer-owned strong element. */
  function renderChild(getProps: GetChildProps): JSX.Element {
    return (
      <strong {...getProps()} data-testid="child">
        Command
      </strong>
    );
  }

  render(
    /** Mount both native composition paths. */
    () => (
      <>
        <Kbd as="span" ref={capture} data-testid="selected">
          ⌘
        </Kbd>
        <Kbd asChild={renderChild} />
      </>
    ),
  );
  expect(screen.getByTestId('selected')).toBe(selected);
  expect(selected?.tagName).toBe('SPAN');
  expect(screen.getByTestId('child').tagName).toBe('STRONG');
  expect(screen.getByTestId('child').className).toContain('lui-kbd');
}

test('Kbd renders native semantics and filters appearance props', verifiesNativeKbd);
test('Kbd follows live provider defaults with instance precedence', verifiesKbdDefaults);
test('Kbd supports native selection and Solid child rendering', verifiesKbdComposition);

/** Verify parent and child refs both receive a consumer-owned button. */
function verifiesKbdChildRefs(): void {
  let parentElement: HTMLElement | undefined;
  let childElement: HTMLElement | undefined;

  /** Record the element forwarded by Kbd. */
  function captureParent(element: HTMLElement): void {
    parentElement = element;
  }

  /** Record the element owned by the child renderer. */
  function captureChild(element: HTMLElement): void {
    childElement = element;
  }

  /** Compose the Kbd props with the button's own ref and semantics. */
  function renderButton(getProps: GetChildProps): JSX.Element {
    return (
      <button {...getProps({ ref: captureChild })} type="button" data-testid="child-button">
        Shortcut
      </button>
    );
  }

  render(
    /** Mount the consumer-owned interactive child without a styling provider. */
    () => <Kbd asChild={renderButton} ref={captureParent} title="Keyboard shortcut" />,
  );
  const button = screen.getByTestId('child-button');
  expect(button).toBe(parentElement);
  expect(button).toBe(childElement);
  expect(button.tagName).toBe('BUTTON');
  expect(button.getAttribute('title')).toBe('Keyboard shortcut');
  button.focus();
  expect(document.activeElement).toBe(button);
}

test('Kbd composes parent and child refs on an asChild button', verifiesKbdChildRefs);
