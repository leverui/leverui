import type { Page } from '@playwright/test';

/** Use the same browser platform signal Zag reads for textarea submission. */
export async function readEditableSubmitKey(page: Page): Promise<'Meta+Enter' | 'Control+Enter'> {
  return page.evaluate(
    /** Choose the browser's actual Apple or non-Apple modifier. */
    () => {
      const browser = navigator as Navigator & { userAgentData?: { platform?: string } };
      const platform = browser.userAgentData?.platform ?? browser.platform;
      return /^Mac|^iPhone|^iPad/i.test(platform) ? 'Meta+Enter' : 'Control+Enter';
    },
  );
}
