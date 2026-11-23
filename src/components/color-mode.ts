import { createSignal, onSettled, type Accessor } from 'solid-js';

/** The document's light or dark appearance. */
export type ColorMode = 'light' | 'dark';

export interface ColorModeControls {
  /** The mode currently applied to the document. */
  readonly colorMode: Accessor<ColorMode>;
  /** Apply a mode to the document and remember it. */
  readonly setColorMode: (mode: ColorMode) => void;
  /** Switch the document to the opposite mode. */
  readonly toggleColorMode: () => void;
}

const colorModeAttribute = 'data-lui-color-mode';

/** The storage key that remembers the reader's chosen mode. */
export const colorModeStorageKey = 'leverui-color-mode';

/** The mode a page starts in before the reader has chosen one. */
export type ColorModeDefault = ColorMode | 'system';

export interface ColorModeScriptOptions {
  /** The mode used when no choice is saved. `system` follows the device setting. */
  readonly defaultMode?: ColorModeDefault | undefined;
}

/**
 * Build the script that applies the saved or default mode before the page paints. The text is
 * the same for the same options, so it can be allowed by hash in a Content Security Policy.
 */
export function getColorModeScript(options: ColorModeScriptOptions = {}): string {
  // Only the two literal mode names are ever written into the script.
  const fallback =
    options.defaultMode === 'light' || options.defaultMode === 'dark'
      ? `'${options.defaultMode}'`
      : "matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'";
  return [
    '(function () {',
    '  var saved = null;',
    '  try {',
    `    saved = localStorage.getItem('${colorModeStorageKey}');`,
    '  } catch (error) {}',
    `  var mode = saved === 'light' || saved === 'dark' ? saved : ${fallback};`,
    '  var root = document.documentElement;',
    `  root.setAttribute('${colorModeAttribute}', mode);`,
    '  root.classList.add(mode);',
    '  root.style.colorScheme = mode;',
    '})();',
  ].join('\n');
}

/** Read the mode currently applied to the document. */
function appliedColorMode(): ColorMode {
  return document.documentElement.getAttribute(colorModeAttribute) === 'dark' ? 'dark' : 'light';
}

/** Apply a mode to the document and remember it when storage is available. */
function applyColorMode(mode: ColorMode): void {
  const root = document.documentElement;
  root.setAttribute(colorModeAttribute, mode);
  root.classList.toggle('dark', mode === 'dark');
  root.classList.toggle('light', mode === 'light');
  root.style.colorScheme = mode;
  try {
    localStorage.setItem(colorModeStorageKey, mode);
  } catch {
    // The mode still applies to this visit when storage is unavailable.
  }
}

/** Switch the document to the opposite mode. */
function toggleColorMode(): void {
  applyColorMode(appliedColorMode() === 'dark' ? 'light' : 'dark');
}

/** Follow the document's color mode from a component and change it. */
export function createColorMode(): ColorModeControls {
  const [colorMode, setCurrentMode] = createSignal<ColorMode>('light');

  onSettled(
    /** Start watching only in the browser, after hydration has finished. */
    () => {
      /** Copy the root attribute into this component's signal. */
      const sync = (): void => {
        setCurrentMode(appliedColorMode());
      };
      sync();
      const observer = new MutationObserver(sync);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [colorModeAttribute],
      });
      return (
        /** Stop watching when the component unmounts. */
        () => observer.disconnect()
      );
    },
  );

  return { colorMode, setColorMode: applyColorMode, toggleColorMode };
}

/** Pick the light or dark value for the current mode. */
export function createColorModeValue<T>(light: T, dark: T): Accessor<T> {
  const { colorMode } = createColorMode();
  return (
    /** Read the value that belongs to the active mode. */
    () => (colorMode() === 'dark' ? dark : light)
  );
}
