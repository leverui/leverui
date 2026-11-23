import { IconButton } from '@leverui/components';
import { createSignal, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { SiteIcon } from './site-icon';

const storageKey = 'leverui-site-color-mode';
type ColorMode = 'light' | 'dark';

/** Read the mode selected before hydration by the document's theme script. */
function documentMode(): ColorMode {
  return document.documentElement.getAttribute('data-lui-color-mode') === 'dark' ? 'dark' : 'light';
}

/** Let visitors switch the site and Lever UI components together. */
export function SiteThemeToggle(): JSX.Element {
  const [mode, setMode] = createSignal<ColorMode>('light');

  /** Persist a manual choice and update the root before the next render. */
  function toggleMode(): void {
    const nextMode = documentMode() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-lui-color-mode', nextMode);
    document.documentElement.style.colorScheme = nextMode;
    try {
      localStorage.setItem(storageKey, nextMode);
    } catch {
      // The mode still changes when storage is unavailable.
    }
    setMode(nextMode);
  }

  onSettled(
    /** Match the control label to the mode applied before hydration. */
    () => {
      setMode(documentMode());
    },
  );

  return (
    <IconButton
      class="site-theme-toggle"
      variant="ghost"
      aria-label={`Switch to ${mode() === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${mode() === 'dark' ? 'light' : 'dark'} theme`}
      onClick={toggleMode}
    >
      <SiteIcon name="sun" class="site-theme-sun" />
      <SiteIcon name="moon" class="site-theme-moon" />
    </IconButton>
  );
}
