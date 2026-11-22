import type { Page } from '@playwright/test';

/** Wait for pending web fonts, since text boxes resize once a font finishes loading. */
export async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(
    /** Resolve once every pending font load settles. */
    async () => {
      await document.fonts.ready;
    },
  );
}
