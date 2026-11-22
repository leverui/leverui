import { expect, test, type Page } from '@playwright/test';

/** Verify the Em example renders native emphasis in its sentence. */
async function verifiesEmBasic({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-em--basic');
  const emphasis = page.locator('#storybook-root em');
  await expect(emphasis).toHaveText('every day');
  await expect(emphasis).toHaveCSS('font-style', 'italic');
  await expect(page.locator('#storybook-root p')).toHaveText(
    'We are open every day except public holidays',
  );
}

test('Em Basic renders native emphasis', verifiesEmBasic);
