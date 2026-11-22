import { expect, test, type Page } from '@playwright/test';

/** Verify a guide-style custom icon, Float, and Avatar composition. */
async function verifiesGuideComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-blockquote-composition--guide');
  const root = page.getByTestId('blockquote-composed');
  const icon = page.getByTestId('blockquote-custom-icon');
  await expect(root).toHaveJSProperty('tagName', 'FIGURE');
  await expect(page.getByTestId('blockquote-float')).toHaveCSS('position', 'absolute');
  await expect(icon).toHaveAttribute('aria-label', 'Custom quotation symbol');
  await expect(icon).not.toHaveAttribute('aria-hidden');
  await expect(icon.locator('circle')).toHaveCount(1);
  await expect(icon.locator('path')).toHaveCount(0);
  await expect(icon).toHaveCSS('width', '20px');
  await expect(icon).toHaveCSS('color', 'rgb(37, 99, 235)');
  await expect(page.getByTestId('blockquote-composed-content')).toHaveAttribute(
    'cite',
    'https://example.com/quote',
  );
  await expect(page.getByTestId('blockquote-composed-caption')).toContainText('Ada Lovelace');
  await expect(page.getByTestId('blockquote-author-avatar')).toHaveCSS('width', '36px');
}

test('Blockquote composes a custom floating icon and author Avatar', verifiesGuideComposition);
