import { expect, test, type Page } from '@playwright/test';

/** Match the compact chart's control and bar placement at the gallery viewport. */
async function checksCompositionLayout({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=charts-bar-chart--composition');
  const root = page.locator('#storybook-root [data-radio-group-root]');
  await expect(root).toContainText('Windows (1,458)');
  await page.evaluate(
    /** Wait for the gallery font before measuring intrinsic control width. */
    () => document.fonts.ready.then(() => undefined),
  );
  expect(Math.round((await root.boundingBox())?.width ?? 0)).toBe(280);
  const first = page.locator('#storybook-root [data-bar-series]').first();
  await expect(first).toBeVisible();
  const bounds = await first.evaluate(
    /** Measure the first compact monthly bar in the browser viewport. */
    (element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return [x, y, width, height].map(Math.round);
    },
  );
  expect(bounds).toEqual([91, 176, 39, 112]);
}

test('compact Bar Chart composition matches layout', checksCompositionLayout);
