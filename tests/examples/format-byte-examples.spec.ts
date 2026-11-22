import { expect, test, type Page } from '@playwright/test';

const storyIds = ['basic', 'sizes', 'format-bits', 'locale', 'unit-display'] as const;

/** Require each Format Byte example to show formatted text. */
async function verifiesFormatByteStories({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-format-byte--${id}`);
    await expect(page.locator('#storybook-root .leverui-text').first()).toHaveText(/\d/);
  }
}

/** Keep the formatted bit, locale, and unit label output. */
async function verifiesFormatByteOutput({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-format-byte--basic');
  await expect(page.locator('#storybook-root')).toContainText('File size: 1.45 kB');
  await page.goto('/iframe.html?id=components-format-byte--format-bits');
  await expect(page.locator('#storybook-root')).toContainText('File size: 1.45 kb');
  await page.goto('/iframe.html?id=components-format-byte--locale');
  await expect(page.locator('#storybook-root')).toContainText('1,45 kB');
  await page.goto('/iframe.html?id=components-format-byte--unit-display');
  await expect(page.locator('#storybook-root')).toContainText('50.3 kilobytes');
}

test('all Format Byte examples render', verifiesFormatByteStories);
test('Format Byte formats units and locales', verifiesFormatByteOutput);
