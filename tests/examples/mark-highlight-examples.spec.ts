import { expect, test, type Page } from '@playwright/test';

const markExamples = ['basic', 'variants'] as const;
const highlightExamples = [
  'basic',
  'multiple',
  'search-query',
  'custom-style',
  'squiggle',
] as const;

/** Verify each public Mark example displays an authored native mark. */
async function verifiesMarkExamples({ page }: { page: Page }): Promise<void> {
  for (const name of markExamples) {
    await page.goto(`/iframe.html?id=typography-mark--${name}`);
    await expect(page.locator('#storybook-root .lui-mark').first()).toBeVisible();
  }
}

/** Verify each public Highlight example renders its matched text. */
async function verifiesHighlightExamples({ page }: { page: Page }): Promise<void> {
  for (const name of highlightExamples) {
    await page.goto(`/iframe.html?id=typography-highlight--${name}`);
    await expect(page.locator('#storybook-root .lui-mark').first()).toBeVisible();
  }
  await page.goto('/iframe.html?id=typography-highlight--basic');
  await expect(page.locator('#storybook-root .lui-mark')).toHaveCSS('padding-left', '2px');
  await page.goto('/iframe.html?id=typography-highlight--squiggle');
  await expect(page.locator('#storybook-root .lui-mark').first()).toHaveCSS('font-style', 'italic');
}

test('public Mark examples use authored CSS', verifiesMarkExamples);
test('public Highlight examples keep their CSS styling', verifiesHighlightExamples);
