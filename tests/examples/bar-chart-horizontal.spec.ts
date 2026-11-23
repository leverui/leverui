import { expect, test, type Page } from '@playwright/test';

/** Keep horizontal categories and guides aligned with the chart. */
async function checksHorizontalAxes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=charts-bar-chart--horizontal');
  const axes = page.locator('#storybook-root [data-bar-axes]');
  await expect(axes).toBeVisible();
  const guides = axes.locator('line');
  await expect(guides).toHaveCount(7);
  const positions = await guides.evaluateAll(
    /** Read each horizontal guide's top edge in the 1280px viewport. */
    (elements) => elements.map((element) => Math.round(element.getBoundingClientRect().y)),
  );
  expect(positions).toEqual([61, 99, 175, 251, 327, 403, 441]);
  await expect(axes.getByText('Jan')).toHaveCSS('font-size', '12px');
  await expect(page.locator('#storybook-root [data-bar-series]')).toHaveCount(15);
}

test('horizontal Bar Chart axes match placement', checksHorizontalAxes);

/** Keep a medium-height cap responsive on mobile while preserving desktop height. */
async function checksHorizontalFrame({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto('/iframe.html?id=charts-bar-chart--horizontal');
  const root = page.locator('#storybook-root .lui-bar-chart');
  const svg = root.locator('svg');
  await expect(svg).toBeVisible();
  const january = svg.locator('[data-bar-series="windows"][data-bar-category="January"]');
  const february = svg.locator('[data-bar-series="windows"][data-bar-category="February"]');
  const januaryBox = await january.boundingBox();
  const februaryBox = await february.boundingBox();
  expect(januaryBox).not.toBeNull();
  expect(februaryBox).not.toBeNull();
  expect(
    Math.abs((februaryBox?.y ?? 0) - (januaryBox?.y ?? 0) - (januaryBox?.height ?? 0)),
  ).toBeLessThan(1);
  const width = await root.evaluate(
    /** Measure the rendered frame after Storybook's public inset. */
    (element) => element.getBoundingClientRect().width,
  );
  expect(Number(await svg.getAttribute('height'))).toBeCloseTo((width * 3) / 4, 1);
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(svg).toHaveAttribute('height', '448');
}

test('horizontal Bar Chart uses a capped landscape frame', checksHorizontalFrame);
