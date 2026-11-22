import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import { InputAddon, type InputAddonProps } from '../index';

type GetChildProps = Parameters<NonNullable<InputAddonProps['asChild']>>[0];

/** Preserve the div, consumer attributes, and native ref. */
function verifiesNativeAddon(): void {
  let received: HTMLDivElement | undefined;

  /** Capture the native element without an adapter wrapper. */
  function capture(element: HTMLDivElement): void {
    received = element;
  }

  render(
    /** Mount a styled addon through the public component. */
    () => (
      <>
        <InputAddon ref={capture} id="native-addon" title="Protocol" size="lg" variant="subtle">
          https://
        </InputAddon>
      </>
    ),
  );

  const addon = screen.getByTitle('Protocol');
  expect(addon).toBe(received);
  expect(addon.tagName).toBe('DIV');
  expect(addon.textContent).toBe('https://');
  expect(addon.className).toContain('leverui-input-addon');
  expect(addon.hasAttribute('size')).toBe(false);
  expect(addon.hasAttribute('variant')).toBe(false);
  expect(addon).toHaveAttribute('data-size', 'lg');
  expect(addon).toHaveAttribute('data-variant', 'subtle');
}

test('Input Addon preserves native markup and finite CSS attributes', verifiesNativeAddon);

/** Keep variants reactive and allow an instance to omit authored styles. */
function verifiesReactiveStyles(): void {
  const [variant, setVariant] = createSignal<'outline' | 'flushed'>('outline');

  /** Render changing and unstyled addon examples without remounting them. */
  function Example(): JSX.Element {
    return (
      <>
        <InputAddon variant={variant()} data-testid="reactive-addon">
          Prefix
        </InputAddon>
        <InputAddon unstyled data-testid="unstyled-addon">
          Plain
        </InputAddon>
      </>
    );
  }

  render(
    /** Mount both examples in one styling scope. */
    () => <Example />,
  );
  const addon = screen.getByTestId('reactive-addon');
  const firstClass = addon.className;
  setVariant('flushed');
  flush();
  expect(screen.getByTestId('reactive-addon')).toBe(addon);
  expect(addon.className).toBe(firstClass);
  expect(addon).toHaveAttribute('data-variant', 'flushed');
  expect(screen.getByTestId('unstyled-addon').className).toContain('leverui-input-addon');
}

test('Input Addon updates CSS variants without replacing the node', verifiesReactiveStyles);

/** Preserve native polymorphism and Solid child-render composition. */
function verifiesSelectedElement(): void {
  let section: HTMLElement | undefined;

  /** Receive the consumer-selected native section. */
  function capture(element: HTMLElement): void {
    section = element;
  }

  /** Put the addon props on the consumer's selected child. */
  function renderChild(getProps: GetChildProps): JSX.Element {
    return (
      <strong {...getProps()} data-testid="child-addon">
        Required
      </strong>
    );
  }

  render(
    /** Mount both supported element-selection paths. */
    () => (
      <>
        <InputAddon as="section" ref={capture} data-testid="section-addon">
          Section
        </InputAddon>
        <InputAddon asChild={renderChild} />
      </>
    ),
  );

  expect(screen.getByTestId('section-addon')).toBe(section);
  expect(section?.tagName).toBe('SECTION');
  expect(screen.getByTestId('child-addon').tagName).toBe('STRONG');
  expect(screen.getByTestId('child-addon').className).toContain('leverui-input-addon');
}

test('Input Addon supports selected native elements and Solid children', verifiesSelectedElement);
