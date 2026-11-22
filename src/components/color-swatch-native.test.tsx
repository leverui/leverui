import { fireEvent, render, screen } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { ColorSwatchMix, type ColorSwatchMixProps } from './color-swatch-mix';

type ChildProps = Parameters<NonNullable<ColorSwatchMixProps['asChild']>>[0];

/** Preserve a caller-owned element, both click handlers, and the mixed cells. */
function verifiesMixedChild(): void {
  const calls: string[] = [];
  let received: HTMLElement | undefined;

  /** Record the click handler supplied by the mixed swatch owner. */
  function recordParent(): void {
    calls.push('parent');
  }

  /** Record the click handler supplied by the caller-owned child. */
  function recordChild(): void {
    calls.push('child');
  }

  /** Receive the caller-owned element through the mixed swatch ref. */
  function capture(element: HTMLElement): void {
    received = element;
  }

  /** Put merged swatch props on a caller-owned button. */
  function renderOwnedMix(getProps: ChildProps): JSX.Element {
    return (
      <button
        {...getProps({ class: 'owned-mix', onClick: recordChild })}
        type="button"
        data-testid="owned-mix"
      />
    );
  }

  render(
    /** Mount the mixed swatch without a styling provider. */
    () => (
      <ColorSwatchMix
        items={['red', 'blue']}
        asChild={renderOwnedMix}
        onClick={recordParent}
        ref={capture}
      />
    ),
  );

  const button = screen.getByTestId('owned-mix');
  expect(button).toBe(received);
  expect(button.classList.contains('leverui-color-swatch')).toBe(true);
  expect(button.classList.contains('owned-mix')).toBe(true);
  expect(button.getAttribute('data-value')).toBe('transparent');
  expect(button.querySelectorAll('[data-mix-cell]')).toHaveLength(2);
  fireEvent.click(button);
  expect(calls).toEqual(['child', 'parent']);
}

it('composes caller-owned mixed swatches with native behavior', verifiesMixedChild);
