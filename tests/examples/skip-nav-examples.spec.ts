import { expect, test, type Page } from '@playwright/test';

/** Check that each example includes the navigation and target copy. */
async function verifiesSkipNavStories({ page }: { page: Page }): Promise<void> {
  for (const story of ['basic', 'basic-example', 'with-content', 'custom-id']) {
    await page.goto(`/iframe.html?id=components-skip-nav--${story}`);
    await expect(page.locator('#storybook-root a[href^="#"]')).toHaveCount(1);
    await expect(page.locator('#storybook-root [tabindex="-1"]')).toHaveCount(1);
  }
}

/** Use the keyboard to follow the skip link to its custom target. */
async function verifiesSkipNavFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-skip-nav--custom-id');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toHaveAttribute('href', '#main-target');
  await expect(page.locator('#main-target')).toHaveCount(1);
  await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-target')).toBeFocused();
}

test('all four Skip Nav stories render', verifiesSkipNavStories);
test('Skip Nav custom target receives keyboard focus', verifiesSkipNavFocus);
