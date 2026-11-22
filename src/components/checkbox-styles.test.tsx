import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { CheckboxControl, CheckboxHiddenInput, CheckboxRoot } from '../index';

afterEach(cleanup);

/** Verify reactive CSS choices retain native nodes without a style provider. */
function verifiesNativeCssChoices(): void {
  const [large, setLarge] = createSignal(false);

  /** Render one Checkbox without Lever UI's style provider. */
  function Example(): JSX.Element {
    return (
      <CheckboxRoot size={large() ? 'lg' : 'sm'} data-testid="root">
        <CheckboxControl data-testid="control" />
        <CheckboxHiddenInput />
      </CheckboxRoot>
    );
  }

  render(Example);
  const root = screen.getByTestId('root');
  const control = screen.getByTestId('control');
  expect(root.getAttribute('data-size')).toBe('sm');
  expect(control.getAttribute('data-size')).toBe('sm');
  expect(control.className).toContain('leverui-checkmark');
  const rootClass = root.className;
  setLarge(true);
  flush();
  expect(screen.getByTestId('root')).toBe(root);
  expect(screen.getByTestId('control')).toBe(control);
  expect(root.getAttribute('data-size')).toBe('lg');
  expect(control.getAttribute('data-size')).toBe('lg');
  expect(root.className).toBe(rootClass);
}

it('binds Checkbox size to native CSS attributes', verifiesNativeCssChoices);
