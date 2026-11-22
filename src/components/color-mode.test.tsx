import { fireEvent, render, screen } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import {
  ColorModeButton,
  DarkMode,
  LightMode,
  colorModeStorageKey,
  createColorMode,
  createColorModeValue,
} from '../index';

afterEach(
  /** Reset the document and storage between tests. */
  () => {
    document.documentElement.removeAttribute('data-leverui-color-mode');
    document.documentElement.className = '';
    localStorage.clear();
  },
);

/** Apply, remember, and report the document mode. */
async function verifiesColorModeControls(): Promise<void> {
  let controls: ReturnType<typeof createColorMode> | undefined;
  let label: (() => string) | undefined;
  render(
    /** Read the mode controls from a component. */
    () => {
      controls = createColorMode();
      label = createColorModeValue('light copy', 'dark copy');
      return <p>{label()}</p>;
    },
  );
  controls?.setColorMode('dark');
  expect(document.documentElement.getAttribute('data-leverui-color-mode')).toBe('dark');
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(localStorage.getItem(colorModeStorageKey)).toBe('dark');
  expect(await screen.findByText('dark copy')).toBeTruthy();
  controls?.toggleColorMode();
  expect(document.documentElement.getAttribute('data-leverui-color-mode')).toBe('light');
  expect(await screen.findByText('light copy')).toBeTruthy();
}

/** Toggle the document mode from the ready-made button. */
async function verifiesColorModeButton(): Promise<void> {
  render(
    /** Mount the button. */
    () => <ColorModeButton />,
  );
  const button = await screen.findByRole('button', { name: 'Toggle color mode' });
  fireEvent.click(button);
  expect(document.documentElement.getAttribute('data-leverui-color-mode')).toBe('dark');
}

/** Scope a fixed mode without adding a layout box. */
function verifiesForcedModes(): void {
  render(
    /** Mount both forced scopes. */
    () => (
      <>
        <LightMode data-testid="light">Light</LightMode>
        <DarkMode data-testid="dark">Dark</DarkMode>
      </>
    ),
  );
  const light = screen.getByTestId('light');
  const dark = screen.getByTestId('dark');
  expect(light.getAttribute('data-leverui-color-mode')).toBe('light');
  expect(dark.getAttribute('data-leverui-color-mode')).toBe('dark');
  expect(light.classList.contains('leverui-color-mode-scope')).toBe(true);
}

it('applies, remembers, and reports the color mode', verifiesColorModeControls);
it('toggles the color mode from ColorModeButton', verifiesColorModeButton);
it('forces light and dark scopes', verifiesForcedModes);
