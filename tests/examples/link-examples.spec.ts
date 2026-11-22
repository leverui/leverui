import { expect, test } from '@playwright/test';

/** Verify the public Link examples preserve their visible contract. */
test('Link examples show native anchors, variants, and the site destination', async ({ page }) => {
  await page.goto('/iframe.html?id=typography-link--basic');
  await expect(page.getByRole('link', { name: 'Visit Lever UI' })).toHaveAttribute('href', '#');

  await page.goto('/iframe.html?id=typography-link--variants');
  await expect(page.getByRole('link', { name: 'Link (underline)' })).toHaveCSS(
    'text-decoration-line',
    'underline',
  );
  await expect(page.getByRole('link', { name: 'Link (plain)' })).toHaveCSS(
    'text-decoration-line',
    'none',
  );

  await page.goto('/iframe.html?id=typography-link--variant-matrix');
  await expect(page.locator('a').filter({ hasText: 'Open in new tab' })).toHaveCount(20);

  await page.goto('/iframe.html?id=typography-link--within-text');
  const link = page.getByRole('link', { name: 'Lever UI' });
  await expect(link).toHaveAttribute('href', 'https://leverui.com');
  await expect(link).toHaveCSS('text-decoration-line', 'underline');

  await page.goto('/iframe.html?id=typography-link--external');
  await expect(
    page.getByRole('link', { name: 'Visit Lever UI' }).locator('svg.lucide-external-link'),
  ).toHaveCount(1);
});
