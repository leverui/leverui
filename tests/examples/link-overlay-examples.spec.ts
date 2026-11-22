import { expect, test, type Page } from '@playwright/test';

/** Check the stretched link's copy, geometry, and native anchor behavior. */
async function verifiesBasicOverlay({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/iframe.html?id=typography-linkoverlay--basic');
  const overlay = page.getByRole('link', { name: 'Click me' });
  await expect(overlay).toHaveAttribute('href', '#');
  await expect(overlay).toHaveCSS('position', 'static');
  const bounds = await overlay.boundingBox();
  expect([bounds?.x, bounds?.y, bounds?.width, bounds?.height]).toEqual([56, 126, 1168, 24]);
  await expect(page.getByRole('heading', { name: 'Want to try it?' })).toBeVisible();
}

/** Check the article overlay and its separately clickable inner link. */
async function verifiesArticleOverlay({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/iframe.html?id=typography-linkoverlay--article');
  const article = page.getByRole('article');
  const overlay = article.getByRole('link', { name: 'Lever UI theming workshop' });
  const inner = article.getByRole('link', { name: 'Inner link' });
  await expect(overlay).toHaveAttribute('href', '#');
  await expect(inner).toHaveAttribute('href', '#inner-link');
  await expect(article.locator('time')).toHaveAttribute(
    'datetime',
    '2021-01-15 15:30:00 +0000 UTC',
  );
  const bounds = await article.boundingBox();
  expect([bounds?.x, bounds?.y, bounds?.width, bounds?.height]).toEqual([56, 56, 384, 218]);

  await page.mouse.click(100, 60);
  await expect(page).toHaveURL(/#$/);
  await inner.click();
  await expect(page).toHaveURL(/#inner-link$/);
}

test('basic LinkOverlay covers its card', verifiesBasicOverlay);
test('article LinkOverlay preserves its inner link', verifiesArticleOverlay);
