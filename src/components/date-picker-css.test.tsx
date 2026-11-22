import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { DatePickerControl, DatePickerInput } from './date-picker-parts-field';
import { DatePickerRoot } from './date-picker-root';

afterEach(cleanup);

/** Verify finite CSS hooks change without replacing the primitive's native input. */
function verifiesDatePickerAppearanceHooks(): void {
  const [large, setLarge] = createSignal(false);
  const [unstyled, setUnstyled] = createSignal(false);

  /** Bind one mounted picker to reactive size, treatment, and outside-day choices. */
  function Example(): JSX.Element {
    return (
      <DatePickerRoot
        size={large() ? { base: 'sm', lg: 'xl' } : 'xs'}
        variant={large() ? 'flushed' : 'outline'}
        hideOutsideDays={large() ? { base: true, lg: false } : false}
        colorPalette={large() ? 'blue' : 'red'}
        unstyled={unstyled()}
        class="consumer-date-picker"
        style={{ width: '280px' }}
        data-testid="root"
      >
        <DatePickerControl>
          <DatePickerInput class="consumer-input" data-testid="input" />
        </DatePickerControl>
      </DatePickerRoot>
    );
  }

  render(
    /** Mount the primitive machine before changing appearance props. */
    () => <Example />,
  );
  const root = screen.getByTestId('root');
  const input = screen.getByTestId('input');
  expect(root).toHaveClass('leverui-date-picker__root', 'consumer-date-picker');
  expect(root).toHaveAttribute('data-size', 'xs');
  expect(input).toHaveClass('leverui-date-picker__input', 'consumer-input');
  expect(input).toHaveAttribute('data-variant', 'outline');
  expect(input).toHaveAttribute('data-leverui-color-palette', 'red');
  expect(root).toHaveStyle({ width: '280px' });
  setLarge(true);
  flush();
  setUnstyled(true);
  flush();
  expect(screen.getByTestId('input')).toBe(input);
  expect(root).toHaveAttribute('data-size', 'sm');
  expect(input).toHaveAttribute('data-size-lg', 'xl');
  expect(input).toHaveAttribute('data-variant', 'flushed');
  expect(input).toHaveAttribute('data-hide-outside-days', 'true');
  expect(input).toHaveAttribute('data-hide-outside-days-lg', 'false');
  expect(input).toHaveAttribute('data-leverui-color-palette', 'blue');
  expect(input).toHaveAttribute('data-unstyled', '');
}

it('emits reactive Date Picker CSS hooks on native parts', verifiesDatePickerAppearanceHooks);
