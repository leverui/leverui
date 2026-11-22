import type { Page } from '@playwright/test';

/** Navigate all controls with Safari's Option-Tab and ordinary Tab elsewhere. */
export async function pressBrowserTab(page: Page, reverse = false): Promise<void> {
  const direction = reverse ? 'Shift+' : '';
  const safari = page.context().browser()?.browserType().name() === 'webkit' ? 'Alt+' : '';
  await page.keyboard.press(`${direction}${safari}Tab`);
}
