import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'sizes',
  'as-props',
  'weights',
  'highlight',
  'composition',
  'gradient',
] as const;

/** Require each Heading story to render its visible sample. */
async function verifiesHeadingStories({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=typography-heading--${id}`);
    await expect(page.locator('#storybook-root .leverui-heading').first()).toHaveText(/\S/);
  }
}

/** Preserve semantic levels, highlighted phrase, and renamed copy. */
async function verifiesHeadingDetails({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-heading--as-props');
  await expect(page.locator('#storybook-root h1')).toHaveText('Level 1');
  await expect(page.locator('#storybook-root h2')).toHaveText('Level 2');
  await expect(page.locator('#storybook-root h3')).toHaveText('Level 3');
  await page.goto('/iframe.html?id=typography-heading--highlight');
  await expect(page.locator('#storybook-root mark')).toHaveText('everyone can use');
  await expect(page.locator('#storybook-root')).toContainText('Lever UI gives you');
}

test('all seven Heading examples render', verifiesHeadingStories);
test('Heading levels and highlighted copy render', verifiesHeadingDetails);
