import type { Page } from '@playwright/test';

/** Allow clipboard interaction in each browser's supported test environment. */
export async function enableBrowserClipboard(page: Page): Promise<void> {
  if (page.context().browser()?.browserType().name() === 'chromium') {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    return;
  }

  await page.addInitScript(
    /** Record copied text where the browser cannot grant clipboard permissions. */
    () => {
      let copiedText = '';

      /** Record the text passed to the browser Clipboard API. */
      async function writeText(value: string): Promise<void> {
        copiedText = value;
      }

      /** Return the last value written by the component. */
      async function readText(): Promise<string> {
        return copiedText;
      }

      /** Observe native copy shortcuts from a selected input or textarea. */
      function captureNativeCopy(): void {
        const active = document.activeElement;
        if (!(active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement)) return;
        copiedText = active.value.slice(active.selectionStart ?? 0, active.selectionEnd ?? 0);
      }

      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText, readText },
      });
      document.addEventListener('copy', captureNativeCopy);
    },
  );
}
