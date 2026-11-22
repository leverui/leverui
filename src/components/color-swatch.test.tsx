import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import {
  ColorSwatch,
  ColorSwatchMix,
  ColorSwatchPropsProvider,
  type ColorSwatchProps,
} from '../index';

type GetSwatchChildProps = Parameters<NonNullable<ColorSwatchProps['asChild']>>[0];

/** Preserve the native span, its color marker, and live value updates. */
function verifiesNativeSwatch(): void {
  const [color, setColor] = createSignal('rgba(255, 0, 0, 0.5)');
  let received: HTMLSpanElement | undefined;

  /** Capture the native element exposed through the public ref. */
  function capture(element: HTMLSpanElement): void {
    received = element;
  }

  render(
    /** Mount a changing swatch in one Solid owner. */
    () => (
      <>
        <ColorSwatch value={color()} ref={capture} title="Sample" data-testid="swatch" />
      </>
    ),
  );

  const swatch = screen.getByTestId('swatch');
  expect(swatch).toBe(received);
  expect(swatch.tagName).toBe('SPAN');
  expect(swatch.getAttribute('data-value')).toBe('rgba(255, 0, 0, 0.5)');
  expect(swatch.getAttribute('title')).toBe('Sample');
  expect(swatch.className).toContain('leverui-color-swatch');
  expect(swatch.hasAttribute('size')).toBe(false);
  expect(swatch.hasAttribute('shape')).toBe(false);
  setColor('blue');
  flush();
  expect(screen.getByTestId('swatch')).toBe(swatch);
  expect(swatch.getAttribute('data-value')).toBe('blue');
}

it('preserves native markup and updates the color marker', verifiesNativeSwatch);

/** Follow provider changes while retaining an explicit instance size. */
function verifiesReactiveDefaults(): void {
  const [large, setLarge] = createSignal(false);

  /** Render inherited and explicit recipe variants together. */
  function Example(): JSX.Element {
    return (
      <>
        <ColorSwatchPropsProvider value={{ size: large() ? 'lg' : 'xs' }}>
          <ColorSwatch value="red" data-testid="inherited" />
          <ColorSwatch value="blue" size="sm" data-testid="fixed" />
        </ColorSwatchPropsProvider>
      </>
    );
  }

  render(
    /** Mount reactive defaults before changing their signal. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited');
  const fixed = screen.getByTestId('fixed');
  expect(inherited.getAttribute('data-size')).toBe('xs');
  expect(fixed.getAttribute('data-size')).toBe('sm');
  setLarge(true);
  flush();
  expect(screen.getByTestId('inherited')).toBe(inherited);
  expect(inherited.getAttribute('data-size')).toBe('lg');
  expect(fixed.getAttribute('data-size')).toBe('sm');
}

it('reacts to provider sizes and respects explicit props', verifiesReactiveDefaults);

/** Render three colors as a clipped two-column grid without leaking items. */
function verifiesMixedColors(): void {
  render(
    /** Mount the mixed composition through the public API. */
    () => (
      <>
        <ColorSwatchMix items={['red', 'green', 'blue']} data-testid="mixed" />
      </>
    ),
  );
  const mixed = screen.getByTestId('mixed');
  expect(mixed.tagName).toBe('SPAN');
  expect(mixed.getAttribute('data-value')).toBe('transparent');
  expect(mixed.hasAttribute('items')).toBe(false);
  expect(mixed.querySelectorAll('[data-value]')).toHaveLength(3);
  expect(mixed.querySelector('[data-value="blue"]')?.getAttribute('class')).toContain(
    'leverui-color-swatch',
  );
}

it('composes three colors within one swatch', verifiesMixedColors);

/** Reject a mix that exceeds the four-color limit. */
function verifiesMixLimit(): void {
  /** Mount an unsupported five-color mix. */
  function mountInvalidMix(): void {
    render(
      /** Construct the invalid mix through the public package API. */
      () => (
        <>
          <ColorSwatchMix items={['red', 'green', 'blue', 'yellow', 'purple']} />
        </>
      ),
    );
  }

  expect(mountInvalidMix).toThrow(/at most four colors/);
}

it('rejects more than four colors', verifiesMixLimit);

/** Update mixed colors without replacing the outer native swatch. */
function verifiesReactiveMix(): void {
  const [items, setItems] = createSignal<readonly string[]>(['red', 'blue']);
  render(
    /** Mount a mix whose color collection can change. */
    () => (
      <>
        <ColorSwatchMix items={items()} data-testid="reactive-mix" />
      </>
    ),
  );
  const outer = screen.getByTestId('reactive-mix');
  expect(outer.querySelectorAll('[data-value]')).toHaveLength(2);
  setItems(['red', 'green', 'blue']);
  flush();
  expect(screen.getByTestId('reactive-mix')).toBe(outer);
  expect(outer.querySelectorAll('[data-value]')).toHaveLength(3);
  expect(outer.querySelector('[data-value="blue"]')).not.toBeNull();
}

it('updates mixed colors on the existing outer swatch', verifiesReactiveMix);

/** Preserve the selected native ref and styled child attributes. */
function verifiesSwatchComposition(): void {
  let button: HTMLButtonElement | undefined;
  let child: HTMLElement | undefined;

  /** Capture the selected native button element. */
  function captureButton(element: HTMLButtonElement): void {
    button = element;
  }

  /** Capture the consumer-owned child element. */
  function captureChild(element: HTMLElement): void {
    child = element;
  }

  /** Apply swatch styles and attributes to a consumer-owned strong element. */
  function renderStrong(getProps: GetSwatchChildProps): JSX.Element {
    return (
      <strong {...getProps()} data-testid="swatch-child">
        Color
      </strong>
    );
  }

  render(
    /** Mount both supported Solid composition paths. */
    () => (
      <>
        <ColorSwatch as="button" value="red" ref={captureButton} data-testid="swatch-button" />
        <ColorSwatch value="blue" asChild={renderStrong} ref={captureChild} title="Blue sample" />
      </>
    ),
  );

  expect(screen.getByTestId('swatch-button')).toBe(button);
  expect(button?.tagName).toBe('BUTTON');
  expect(button?.getAttribute('data-value')).toBe('red');
  expect(screen.getByTestId('swatch-child')).toBe(child);
  expect(child?.tagName).toBe('STRONG');
  expect(child?.getAttribute('title')).toBe('Blue sample');
  expect(child?.getAttribute('data-value')).toBe('blue');
  expect(child?.className).toContain('leverui-color-swatch');
}

it(
  'forwards swatch styling, native attributes, and refs through composition',
  verifiesSwatchComposition,
);
