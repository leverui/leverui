import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { SelectRoot } from './select-root';
import { SelectTrigger, SelectValueText } from './select-controls';
import { SelectContent, SelectList, SelectPositioner } from './select-overlay';
import { SelectItem } from './select-items';
import { createListCollection } from './select-machine';

const collection = createListCollection({ items: [{ label: 'Solid', value: 'solid' }] });
afterEach(cleanup);

/** Verify finite CSS hooks change without replacing the primitive's native trigger. */
function verifiesSelectAppearanceHooks(): void {
  const [large, setLarge] = createSignal(false);
  const [unstyled, setUnstyled] = createSignal(false);

  /** Bind one mounted Select to reactive size, treatment, and palette choices. */
  function Example(): JSX.Element {
    return (
      <SelectRoot
        collection={collection}
        size={large() ? { base: 'sm', md: 'lg' } : 'xs'}
        variant={large() ? 'ghost' : 'outline'}
        colorPalette={large() ? 'blue' : 'red'}
        unstyled={unstyled()}
        class="consumer-select"
        style={{ width: '280px' }}
        data-testid="root"
      >
        <SelectTrigger class="consumer-trigger" data-testid="trigger">
          <SelectValueText placeholder="Choose one" />
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent data-testid="content">
            <SelectList>
              <SelectItem item={collection.items[0]!}>Solid</SelectItem>
            </SelectList>
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>
    );
  }

  render(
    /** Mount a single primitive machine before changing appearance props. */
    () => <Example />,
  );
  const root = screen.getByTestId('root');
  const trigger = screen.getByTestId('trigger');
  expect(root).toHaveClass('leverui-select__root', 'consumer-select');
  expect(root).toHaveAttribute('data-size', 'xs');
  expect(trigger).toHaveClass('leverui-select__trigger', 'consumer-trigger');
  expect(trigger).toHaveAttribute('data-variant', 'outline');
  expect(trigger).toHaveAttribute('data-leverui-color-palette', 'red');
  expect(root).toHaveStyle({ width: '280px' });
  setLarge(true);
  flush();
  setUnstyled(true);
  flush();
  expect(screen.getByTestId('trigger')).toBe(trigger);
  expect(root).toHaveAttribute('data-size', 'sm');
  expect(trigger).toHaveAttribute('data-size-md', 'lg');
  expect(trigger).toHaveAttribute('data-variant', 'ghost');
  expect(trigger).toHaveAttribute('data-leverui-color-palette', 'blue');
  expect(trigger).toHaveAttribute('data-unstyled', '');
}

it('emits reactive Select CSS hooks on native parts', verifiesSelectAppearanceHooks);
