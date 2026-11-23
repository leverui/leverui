import { render } from '@solidjs/testing-library';
import { afterEach, expect, it, vi } from 'vitest';
import { ColorModeScript, colorModeStorageKey, getColorModeScript } from '../index';

afterEach(
  /** Reset the document, storage, and stubs between tests. */
  () => {
    document.documentElement.removeAttribute('data-lui-color-mode');
    document.documentElement.className = '';
    document.documentElement.style.colorScheme = '';
    localStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  },
);

/** Report a device that prefers the given mode. */
function stubSystemMode(dark: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    /** Answer the one media query the script asks. */
    () => ({ matches: dark }),
  );
}

/** Run the script as a browser would run it from the document head. */
function runScript(script: string): void {
  new Function(script)();
}

/** Read the mode the script left on the document. */
function appliedMode(): string | null {
  return document.documentElement.getAttribute('data-lui-color-mode');
}

/** Apply a saved choice to the attribute, the class, and the color scheme. */
function appliesSavedChoice(): void {
  stubSystemMode(false);
  localStorage.setItem(colorModeStorageKey, 'dark');
  runScript(getColorModeScript());
  expect(appliedMode()).toBe('dark');
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(document.documentElement.style.colorScheme).toBe('dark');
}

/** Follow the device setting when nothing is saved, and ignore a value that is not a mode. */
function followsSystemSetting(): void {
  stubSystemMode(true);
  localStorage.setItem(colorModeStorageKey, 'purple');
  runScript(getColorModeScript());
  expect(appliedMode()).toBe('dark');
  stubSystemMode(false);
  runScript(getColorModeScript({ defaultMode: 'system' }));
  expect(appliedMode()).toBe('light');
}

/** Use a fixed default without asking the device, while a saved choice still wins. */
function usesFixedDefault(): void {
  stubSystemMode(false);
  runScript(getColorModeScript({ defaultMode: 'dark' }));
  expect(appliedMode()).toBe('dark');
  localStorage.setItem(colorModeStorageKey, 'light');
  runScript(getColorModeScript({ defaultMode: 'dark' }));
  expect(appliedMode()).toBe('light');
}

/** Still apply the default when the browser blocks storage. */
function survivesBlockedStorage(): void {
  stubSystemMode(true);
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
    /** Fail as a browser does when storage is not allowed. */
    () => {
      throw new Error('Storage is blocked.');
    },
  );
  runScript(getColorModeScript());
  expect(appliedMode()).toBe('dark');
}

/** Keep the text stable and free of characters that server rendering would escape. */
function keepsStableSafeText(): void {
  const script = getColorModeScript({ defaultMode: 'light' });
  expect(getColorModeScript({ defaultMode: 'light' })).toBe(script);
  expect(script).not.toMatch(/[<&]/);
  expect(getColorModeScript()).not.toMatch(/[<&]/);
  expect(getColorModeScript()).toBe(getColorModeScript({ defaultMode: 'system' }));
}

/** Render the same script in a script element, with the nonce when one is given. */
function rendersScriptElement(): void {
  const { container } = render(
    /** Mount the component as a document head would. */
    () => <ColorModeScript defaultMode="dark" nonce="abc123" />,
  );
  const element = container.querySelector('script');
  expect(element?.textContent).toBe(getColorModeScript({ defaultMode: 'dark' }));
  expect(element?.nonce).toBe('abc123');
}

it('applies a saved choice', appliesSavedChoice);
it('follows the device setting when nothing is saved', followsSystemSetting);
it('uses a fixed default mode', usesFixedDefault);
it('applies the default when storage is blocked', survivesBlockedStorage);
it('keeps the script text stable and safe to server render', keepsStableSafeText);
it('renders the script in a script element', rendersScriptElement);
