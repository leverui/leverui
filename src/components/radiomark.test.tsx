import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Radiomark, type RadiomarkProps } from '../index';

type GetChildProps = Parameters<NonNullable<RadiomarkProps<'span'>['asChild']>>[0];

afterEach(cleanup);

/** Render a caller-owned span through the public child contract. */
function renderOwnedSpan(getProps: GetChildProps): JSX.Element {
  return <span {...getProps()} data-testid="owned-mark" />;
}

/** Verify the visual state markup and native composition. */
function verifiesStaticRadiomark(): void {
  let received: HTMLSpanElement | undefined;

  /** Record the default native span ref. */
  function capture(element: HTMLSpanElement): void {
    received = element;
  }

  render(
    /** Mount states and child content in one Solid owner. */
    () => (
      <>
        <Radiomark data-testid="unchecked-mark" ref={capture} aria-label="Unselected" />
        <Radiomark checked disabled variant="outline" filled size="lg" data-testid="checked-mark">
          <span data-testid="custom-child">Custom</span>
        </Radiomark>
        <Radiomark checked asChild={renderOwnedSpan} data-testid="parent-mark" />
      </>
    ),
  );

  const unchecked = screen.getByTestId('unchecked-mark');
  const checked = screen.getByTestId('checked-mark');
  const owned = screen.getByTestId('owned-mark');
  expect(unchecked).toBe(received);
  expect(unchecked.tagName).toBe('SPAN');
  expect(unchecked.hasAttribute('data-checked')).toBe(false);
  expect(unchecked.querySelector('.dot')).toBeNull();
  expect(unchecked.getAttribute('aria-label')).toBe('Unselected');
  expect(unchecked.hasAttribute('role')).toBe(false);
  expect(checked.getAttribute('data-checked')).toBe('');
  expect(checked.getAttribute('data-disabled')).toBe('');
  expect(checked.querySelectorAll('.dot')).toHaveLength(1);
  expect(checked.querySelector('[data-testid="custom-child"]')).toBeNull();
  expect(checked.children).toHaveLength(1);
  expect(checked.textContent).toBe('');
  expect(checked.className).toContain('leverui-radiomark');
  expect(owned.querySelectorAll('.dot')).toHaveLength(1);
  for (const attribute of ['checked', 'disabled', 'variant', 'filled', 'size']) {
    expect(checked.hasAttribute(attribute)).toBe(false);
  }
}

it('renders only the dot while preserving native composition', verifiesStaticRadiomark);

/** Keep the same span while checked, disabled, and CSS choices change. */
function verifiesReactiveRadiomark(): void {
  const [checked, setChecked] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);
  const [size, setSize] = createSignal<'xs' | 'lg'>('xs');

  render(
    /** Bind changing props to one mounted Radiomark instance. */
    () => (
      <>
        <Radiomark
          data-testid="reactive-mark"
          checked={checked()}
          disabled={disabled()}
          size={size()}
        />
      </>
    ),
  );

  const mark = screen.getByTestId('reactive-mark');
  expect(mark.querySelector('.dot')).toBeNull();
  setChecked(true);
  flush();
  expect(screen.getByTestId('reactive-mark')).toBe(mark);
  expect(mark.getAttribute('data-checked')).toBe('');
  expect(mark.querySelectorAll('.dot')).toHaveLength(1);
  setDisabled(true);
  flush();
  expect(mark.getAttribute('data-disabled')).toBe('');
  setSize('lg');
  flush();
  expect(screen.getByTestId('reactive-mark')).toBe(mark);
  setChecked(false);
  flush();
  expect(mark.querySelector('.dot')).toBeNull();
  expect(mark.hasAttribute('data-checked')).toBe(false);
}

it('updates state and CSS choices without replacing the span', verifiesReactiveRadiomark);

/** Verify caller-owned child refs, native styles, and reactive dot content. */
function verifiesOwnedRadiomark(): void {
  const [checked, setChecked] = createSignal(false);
  let parentElement: HTMLElement | undefined;
  let childElement: HTMLElement | undefined;

  /** Record the parent ref's mounted element. */
  function captureParent(element: HTMLElement): void {
    parentElement = element;
  }

  /** Record the caller-owned child's mounted element. */
  function captureChild(element: HTMLElement): void {
    childElement = element;
  }

  /** Give the child its own class and ref while accepting parent attributes. */
  function renderOwned(getProps: GetChildProps): JSX.Element {
    return (
      <span {...getProps({ class: 'child-owned', ref: captureChild })} data-testid="owned-live" />
    );
  }

  render(
    /** Mount without a styling provider to exercise native composition. */
    () => (
      <Radiomark
        checked={checked()}
        asChild={renderOwned}
        ref={captureParent}
        class="parent-owned"
        style={{ color: 'rgb(12, 34, 56)' }}
      />
    ),
  );

  const mark = screen.getByTestId('owned-live');
  expect(parentElement).toBe(mark);
  expect(childElement).toBe(mark);
  expect(mark.className).toContain('parent-owned');
  expect(mark.className).toContain('child-owned');
  expect(mark.style.color).toBe('rgb(12, 34, 56)');
  expect(mark.querySelector('.dot')).toBeNull();
  setChecked(true);
  flush();
  expect(screen.getByTestId('owned-live')).toBe(mark);
  expect(mark.querySelectorAll('.leverui-radiomark__dot')).toHaveLength(1);
}

it('composes caller-owned child refs and native styles without a provider', verifiesOwnedRadiomark);
