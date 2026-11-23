import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Button, ButtonPropsProvider } from '../index';

/** Keep responsive size attributes reactive without remounting the Button. */
function verifiesResponsiveSizeUpdates(): void {
  const [large, setLarge] = createSignal(false);

  /** Read the current breakpoint choices inside Solid's tracked scope. */
  function Example(): JSX.Element {
    return (
      <Button
        data-testid="responsive-button"
        size={large() ? { base: 'lg', md: '2xl' } : { base: 'sm', md: 'xl' }}
      >
        Resize
      </Button>
    );
  }

  render(
    /** Mount the responsive action with native CSS hooks. */
    () => <Example />,
  );
  const button = screen.getByTestId('responsive-button');
  expect(button.getAttribute('data-size')).toBe('sm');
  expect(button.getAttribute('data-size-md')).toBe('xl');
  expect(button.hasAttribute('data-lui-private-style-runtime')).toBe(false);

  setLarge(true);
  flush();
  expect(screen.getByTestId('responsive-button')).toBe(button);
  expect(button.getAttribute('data-size')).toBe('lg');
  expect(button.getAttribute('data-size-md')).toBe('2xl');
  expect(button.hasAttribute('data-lui-private-style-runtime')).toBe(false);
}

it('updates responsive Button choices on the native CSS path', verifiesResponsiveSizeUpdates);

/** Keep inherited responsive choices on the native path as defaults change. */
function verifiesResponsiveProviderDefaults(): void {
  const [large, setLarge] = createSignal(false);

  /** Share the current breakpoint choices with the descendant Button. */
  function Example(): JSX.Element {
    return (
      <ButtonPropsProvider value={{ size: large() ? { sm: '2xl' } : { sm: 'xs' } }}>
        <Button data-testid="inherited-responsive-button">Inherited</Button>
      </ButtonPropsProvider>
    );
  }

  render(
    /** Mount the provider and Button in one reactive owner. */
    () => <Example />,
  );
  const button = screen.getByTestId('inherited-responsive-button');
  expect(button.getAttribute('data-size')).toBe('md');
  expect(button.getAttribute('data-size-sm')).toBe('xs');

  setLarge(true);
  flush();
  expect(screen.getByTestId('inherited-responsive-button')).toBe(button);
  expect(button.getAttribute('data-size-sm')).toBe('2xl');
  expect(button.hasAttribute('data-lui-private-style-runtime')).toBe(false);
}

it(
  'inherits reactive responsive sizes without entering the style runtime',
  verifiesResponsiveProviderDefaults,
);

/** Keep finite variant selections reactive on the same native element. */
function verifiesResponsiveVariantUpdates(): void {
  const [outlined, setOutlined] = createSignal(false);

  /** Read changing variants through the native Button path. */
  function Example(): JSX.Element {
    return (
      <Button
        data-testid="responsive-variant-button"
        variant={outlined() ? { base: 'outline', md: 'ghost' } : { base: 'surface', md: 'solid' }}
      >
        Treatment
      </Button>
    );
  }

  render(
    /** Mount the action without a styling provider. */
    () => <Example />,
  );
  const button = screen.getByTestId('responsive-variant-button');
  expect(button.getAttribute('data-variant')).toBe('surface');
  expect(button.getAttribute('data-variant-md')).toBe('solid');
  expect(button.hasAttribute('data-lui-private-style-runtime')).toBe(false);

  setOutlined(true);
  flush();
  expect(screen.getByTestId('responsive-variant-button')).toBe(button);
  expect(button.getAttribute('data-variant')).toBe('outline');
  expect(button.getAttribute('data-variant-md')).toBe('ghost');
  expect(button.hasAttribute('data-lui-private-style-runtime')).toBe(false);
}

it('updates responsive Button variants on the native CSS path', verifiesResponsiveVariantUpdates);
