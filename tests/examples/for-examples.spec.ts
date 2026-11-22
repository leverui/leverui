import { expect, test, type Page } from '@playwright/test';

/** Open one For example in its isolated Storybook canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-for--${id}`);
}

/** Verify each item renders and the fallback appears for an empty list. */
async function verifiesForExamples({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  await expect(page.getByText('Two')).toBeVisible();

  await openStory(page, 'with-object');
  await expect(page.getByText('Powers: Stormcalling, Farsight')).toBeVisible();

  await openStory(page, 'with-fallback');
  await expect(page.getByText('No items to show')).toBeVisible();
}

test('For examples render items and fallback', verifiesForExamples);
