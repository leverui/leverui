import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Icon } from '../index';

/** Keep one native SVG while finite responsive size attributes change. */
function verifiesResponsiveSize(): void {
  const [large, setLarge] = createSignal(false);

  /** Bind a changing breakpoint choice to the public Icon. */
  function Example(): JSX.Element {
    return (
      <>
        <Icon data-testid="responsive-icon" size={{ base: large() ? 'sm' : 'xs', md: 'lg' }} />
        <Icon data-testid="unstyled-icon" class="consumer-icon" unstyled />
      </>
    );
  }

  render(
    /** Mount Icon without a style provider. */
    () => <Example />,
  );
  const icon = screen.getByTestId('responsive-icon');
  expect(icon.getAttribute('data-size')).toBe('xs');
  expect(icon.getAttribute('data-size-md')).toBe('lg');
  expect(icon.getAttribute('size')).toBeNull();
  setLarge(true);
  flush();
  expect(screen.getByTestId('responsive-icon')).toBe(icon);
  expect(icon.getAttribute('data-size')).toBe('sm');
  expect(screen.getByTestId('unstyled-icon').getAttribute('class')).toContain('lui-icon');
  expect(screen.getByTestId('unstyled-icon').hasAttribute('data-unstyled')).toBe(true);
  expect(screen.getByTestId('unstyled-icon').hasAttribute('width')).toBe(false);
  expect(screen.getByTestId('unstyled-icon').hasAttribute('height')).toBe(false);
}

it('binds Icon sizes to authored CSS without runtime style insertion', verifiesResponsiveSize);
