import { expect, test, type Page } from '@playwright/test';

/** Return the largest gap between measured and expected values. */
function largestGap(measured: number[], expected: number[]): number {
  return Math.max(
    ...measured.map(
      /** Measure one value's distance from its expected value. */
      (value, index) => Math.abs(value - (expected[index] ?? 0)),
    ),
  );
}

/** Match the compact chart's control and bar placement at the gallery viewport. */
async function checksCompositionLayout({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=charts-bar-chart--composition');
  const root = page.locator('#storybook-root [data-radio-group-root]');
  await expect(root).toContainText('Windows (1,458)');
  await page.evaluate(
    /** Wait for the gallery font before measuring intrinsic control width. */
    () => document.fonts.ready.then(() => undefined),
  );
  // Linux and macOS draw the labels a few pixels apart, so allow four pixels.
  expect(Math.abs(((await root.boundingBox())?.width ?? 0) - 280)).toBeLessThan(4);
  const first = page.locator('#storybook-root [data-bar-series]').first();
  await expect(first).toBeVisible();
  const bounds = await first.evaluate(
    /** Measure the first compact monthly bar in the browser viewport. */
    (element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return [x, y, width, height];
    },
  );
  expect(largestGap(bounds, [91, 176, 39, 112])).toBeLessThan(4);
}

test('compact Bar Chart composition matches layout', checksCompositionLayout);
