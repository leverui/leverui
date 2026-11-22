import { expect, test, type Page } from '@playwright/test';

const expectedText = {
  basic: '1,450.45',
  percentage: '14.50%',
  currency: '$1,234.45',
  locale: '1.450,45',
  unit: '384.4 km',
  'compact-notation': '1.5M',
} as const;

/** Require each Format Number example to display the formatted text. */
async function verifiesFormatNumberStories({ page }: { page: Page }): Promise<void> {
  for (const [id, text] of Object.entries(expectedText)) {
    await page.goto(`/iframe.html?id=components-format-number--${id}`);
    await expect(page.locator('#storybook-root')).toContainText(text);
  }
}

test('all Format Number examples format their values', verifiesFormatNumberStories);
