import { expect, test, type Page } from '@playwright/test';

/** Confirm that a Solid story renders and responds to browser input. */
async function verifySolidStory({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-browser-smoke--ready&viewMode=story');
  const button = page.getByRole('button', { name: 'Clicks: 0' });
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.getByRole('button', { name: 'Clicks: 1' })).toBeVisible();
}

test('Storybook runs Solid stories in a browser', verifySolidStory);
