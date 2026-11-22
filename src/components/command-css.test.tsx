import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { CommandControl, CommandInput } from './command-controls';
import { CommandRoot } from './command-root';
import { useCommandCollection } from './use-command-collection';

afterEach(cleanup);

/** Verify native Command nodes retain identity as finite CSS hooks change. */
function verifiesCommandAppearanceHooks(): void {
  const [large, setLarge] = createSignal(false);
  const [unstyled, setUnstyled] = createSignal(false);

  /** Mount one reactive Command machine with consumer-owned native props. */
  function Example(): JSX.Element {
    const command = useCommandCollection({
      initialItems: [{ value: 'open', label: 'Open file' }],
    });
    return (
      <CommandRoot
        command={command}
        size={large() ? { base: 'sm', md: 'lg' } : 'md'}
        colorPalette={large() ? 'blue' : 'red'}
        unstyled={unstyled()}
        class="consumer-command"
        style={{ width: '280px' }}
        data-testid="root"
      >
        <CommandControl>
          <CommandInput class="consumer-input" data-testid="input" />
        </CommandControl>
      </CommandRoot>
    );
  }

  render(
    /** Keep one Solid owner while appearance signals change. */
    () => <Example />,
  );
  const root = screen.getByTestId('root');
  const input = screen.getByTestId('input');
  expect(root).toHaveClass('leverui-command__root', 'consumer-command');
  expect(root).toHaveAttribute('data-size', 'md');
  expect(input).toHaveClass('leverui-command__input', 'consumer-input');
  expect(input).toHaveAttribute('data-leverui-color-palette', 'red');
  expect(root).toHaveStyle({ width: '280px' });
  setLarge(true);
  flush();
  setUnstyled(true);
  flush();
  expect(screen.getByTestId('input')).toBe(input);
  expect(root).toHaveAttribute('data-size', 'sm');
  expect(input).toHaveAttribute('data-size-md', 'lg');
  expect(input).toHaveAttribute('data-leverui-color-palette', 'blue');
  expect(input).toHaveAttribute('data-unstyled', '');
}

it('emits reactive Command CSS hooks on native parts', verifiesCommandAppearanceHooks);
