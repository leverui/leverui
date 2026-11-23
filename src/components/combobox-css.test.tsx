import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { ComboboxControl, ComboboxInput } from './combobox-controls';
import { createListCollection } from './combobox-machine';
import { ComboboxRoot } from './combobox-root';

const collection = createListCollection({ items: [{ label: 'Solid', value: 'solid' }] });
afterEach(cleanup);

/** Verify finite CSS hooks change without replacing the primitive's native input. */
function verifiesComboboxAppearanceHooks(): void {
  const [large, setLarge] = createSignal(false);
  const [unstyled, setUnstyled] = createSignal(false);

  /** Bind one mounted Combobox to reactive size, treatment, and palette choices. */
  function Example(): JSX.Element {
    return (
      <ComboboxRoot
        collection={collection}
        size={large() ? { base: 'sm', md: 'lg' } : 'xs'}
        variant={large() ? 'flushed' : 'outline'}
        colorPalette={large() ? 'blue' : 'red'}
        unstyled={unstyled()}
        class="consumer-combobox"
        style={{ width: '280px' }}
        data-testid="root"
      >
        <ComboboxControl>
          <ComboboxInput class="consumer-input" data-testid="input" />
        </ComboboxControl>
      </ComboboxRoot>
    );
  }

  render(
    /** Mount one primitive machine before changing appearance props. */
    () => <Example />,
  );
  const root = screen.getByTestId('root');
  const input = screen.getByTestId('input');
  expect(root).toHaveClass('lui-combobox__root', 'consumer-combobox');
  expect(root).toHaveAttribute('data-size', 'xs');
  expect(input).toHaveClass('lui-combobox__input', 'consumer-input');
  expect(input).toHaveAttribute('data-variant', 'outline');
  expect(input).toHaveAttribute('data-lui-color-palette', 'red');
  expect(root).toHaveStyle({ width: '280px' });
  setLarge(true);
  flush();
  setUnstyled(true);
  flush();
  expect(screen.getByTestId('input')).toBe(input);
  expect(root).toHaveAttribute('data-size', 'sm');
  expect(input).toHaveAttribute('data-size-md', 'lg');
  expect(input).toHaveAttribute('data-variant', 'flushed');
  expect(input).toHaveAttribute('data-lui-color-palette', 'blue');
  expect(input).toHaveAttribute('data-unstyled', '');
}

it('emits reactive Combobox CSS hooks on native parts', verifiesComboboxAppearanceHooks);
