import { expect, test, type Page } from '@playwright/test';

/** Verify the story updates when the preview crosses the large breakpoint. */
async function checksResponsiveValue({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.goto('/iframe.html?id=hooks-usebreakpointvalue--basic');
  await expect(page.locator('#storybook-root')).toHaveText('false');
  await page.setViewportSize({ width: 1200, height: 600 });
  await expect(page.locator('#storybook-root')).toHaveText('true');
  await page.setViewportSize({ width: 900, height: 600 });
  await expect(page.locator('#storybook-root')).toHaveText('false');
}

test('useBreakpointValue follows viewport changes', checksResponsiveValue);
