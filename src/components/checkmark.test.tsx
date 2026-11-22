import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Checkmark, type CheckmarkProps } from '../index';

type GetCheckmarkChildProps = Parameters<NonNullable<CheckmarkProps<'svg'>['asChild']>>[0];

/** Capture the selected native SVG without changing its attributes. */
function renderChildSvg(getProps: GetCheckmarkChildProps): JSX.Element {
  return <svg {...getProps()} data-testid="child-checkmark" viewBox="0 0 32 32" />;
}

/** Verify SVG defaults, native overrides, and ignored consumer children. */
function verifiesNativeSvg(): void {
  let received: SVGSVGElement | undefined;

  /** Record the public SVG ref. */
  function capture(element: SVGSVGElement): void {
    received = element;
  }

  render(
    /** Supply the theme system for the styled Checkmark. */
    () => (
      <>
        <Checkmark data-testid="unchecked-checkmark" ref={capture} aria-label="Unchecked" />
        <Checkmark checked data-testid="checked-checkmark" viewBox="0 0 32 32">
          <circle data-testid="ignored-child" />
        </Checkmark>
        <Checkmark checked asChild={renderChildSvg} />
      </>
    ),
  );
  const unchecked = screen.getByTestId('unchecked-checkmark');
  const checked = screen.getByTestId('checked-checkmark');
  const child = screen.getByTestId('child-checkmark');
  expect(unchecked).toBe(received);
  expect(unchecked.tagName.toLowerCase()).toBe('svg');
  expect(unchecked.getAttribute('data-state')).toBe('unchecked');
  expect(unchecked.querySelector('path, polyline')).toBeNull();
  expect(unchecked.getAttribute('viewBox')).toBe('0 0 24 24');
  expect(checked.getAttribute('viewBox')).toBe('0 0 32 32');
  expect(checked.querySelector('polyline')?.getAttribute('points')).toBe('20 6 9 17 4 12');
  expect(screen.queryByTestId('ignored-child')).toBeNull();
  expect(child.getAttribute('viewBox')).toBe('0 0 32 32');
  expect(child.querySelector('polyline')).not.toBeNull();
}

it('renders the SVG glyph and preserves native composition', verifiesNativeSvg);

/** Verify state priority and live disabled attributes without remounting. */
function verifiesReactiveState(): void {
  const [checked, setChecked] = createSignal(false);
  const [indeterminate, setIndeterminate] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);
  render(
    /** Keep the three state signals under one mounted Checkmark. */
    () => (
      <>
        <Checkmark
          data-testid="reactive-checkmark"
          checked={checked()}
          indeterminate={indeterminate()}
          disabled={disabled()}
          variant="outline"
          filled
          size="lg"
        />
      </>
    ),
  );
  const root = screen.getByTestId('reactive-checkmark');
  expect(root.getAttribute('data-state')).toBe('unchecked');
  setChecked(true);
  flush();
  expect(screen.getByTestId('reactive-checkmark')).toBe(root);
  expect(root.getAttribute('data-state')).toBe('checked');
  expect(root.querySelector('polyline')).not.toBeNull();
  setIndeterminate(true);
  flush();
  expect(root.getAttribute('data-state')).toBe('indeterminate');
  expect(root.querySelector('path')?.getAttribute('d')).toBe('M5 12h14');
  expect(root.querySelector('polyline')).toBeNull();
  setDisabled(true);
  flush();
  expect(root.hasAttribute('data-disabled')).toBe(true);
  expect(root.getAttribute('data-disabled')).toBe('');
  for (const attribute of ['checked', 'indeterminate', 'disabled', 'variant', 'filled', 'size']) {
    expect(root.hasAttribute(attribute)).toBe(false);
  }
}

it('updates checked, indeterminate, and disabled state in place', verifiesReactiveState);

/** Verify styling choices update native hooks without a provider or style tag. */
function verifiesReactiveChoices(): void {
  const [size, setSize] = createSignal<'xs' | 'lg'>('xs');
  const [variant, setVariant] = createSignal<'solid' | 'outline'>('solid');
  const [filled, setFilled] = createSignal(false);
  const [palette, setPalette] = createSignal('blue');
  render(
    /** Keep the same standalone SVG mounted while selections change. */
    () => (
      <Checkmark
        data-testid="choice-checkmark"
        checked
        size={size()}
        variant={variant()}
        filled={filled()}
        colorPalette={palette()}
      />
    ),
  );
  const root = screen.getByTestId('choice-checkmark');
  expect(root.getAttribute('data-size')).toBe('xs');
  expect(root.getAttribute('data-variant')).toBe('solid');
  expect(root.hasAttribute('data-filled')).toBe(false);
  expect(root.getAttribute('data-leverui-color-palette')).toBe('blue');
  setSize('lg');
  flush();
  setVariant('outline');
  flush();
  setFilled(true);
  flush();
  setPalette('red');
  flush();
  expect(screen.getByTestId('choice-checkmark')).toBe(root);
  expect(root.getAttribute('data-size')).toBe('lg');
  expect(root.getAttribute('data-variant')).toBe('outline');
  expect(root.hasAttribute('data-filled')).toBe(true);
  expect(root.getAttribute('data-leverui-color-palette')).toBe('red');
}

it('updates CSS choices on the same standalone SVG', verifiesReactiveChoices);

/** Verify a caller-owned SVG keeps its identity while the glyph changes. */
function verifiesReactiveChildSvg(): void {
  const [checked, setChecked] = createSignal(false);
  const { container } = render(
    /** Keep the caller-owned SVG mounted across state transitions. */
    () => <Checkmark asChild={renderChildSvg} checked={checked()} />,
  );
  const root = container.querySelector('[data-testid="child-checkmark"]');
  if (!root) throw new Error('The caller-owned Checkmark SVG was not mounted.');
  expect(root.getAttribute('data-state')).toBe('unchecked');
  expect(root.querySelector('polyline')).toBeNull();
  setChecked(true);
  flush();
  expect(container.querySelector('[data-testid="child-checkmark"]')).toBe(root);
  expect(root.getAttribute('data-state')).toBe('checked');
  expect(root.querySelector('polyline')?.getAttribute('points')).toBe('20 6 9 17 4 12');
  setChecked(false);
  flush();
  expect(root.getAttribute('data-state')).toBe('unchecked');
  expect(root.querySelector('polyline')).toBeNull();
}

it('updates a caller-owned SVG glyph without replacing it', verifiesReactiveChildSvg);
